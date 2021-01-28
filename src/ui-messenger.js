class uiMessenger extends uiBase {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-MESSENGER";
    }

    static get singleton() {
        var elements = document.getElementsByTagName(this.tagname);

        for (var i=0; i < elements.length; ++i) {
            return elements[i];
        }

        return this.attachSingleton(document.createElement(this.tagname));
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();

        this.registrations = {};
        this.idcount = 0;
    }

    //=========================================================
    //                    Object Properties
    //=========================================================
    get visible_mode() {
        return this.hidden_mode;
    }

    //=========================================================
    //                     Message Routing
    //=========================================================
    register(element, topic) {
        if (topic in {null: 0, "": 0, "null": 0}) {
            return;
        }

        if (element.id in {null: 0, "": 0}) {
            element.id = "ui_messaging_" + this.idcount++;
        }

        var topic = topic.toLowerCase();

        if (this.registrations[topic] == null) {
            this.registrations[topic] = {};
        }

        this.registrations[topic][element.id] = 1;
    }

    deregister(element, topic) {
        if (element.id in {null: 0, "": 0}) {
            return;
        }

        var topic = topic.toLowerCase();

        if (this.registrations[topic] == null) {
            return;
        }

        if (! (topic in this.registrations)) {
            return;
        }

        this.registrations[topic][element.id] == 0;
    }

    broadcast(topic, payload) {
        var topic = topic.toLowerCase();

        var registered_elements = Object.entries(this.registrations[topic] || {}).filter(
            function(pair) {
                const [_id, _bool] = pair;
                return _bool;
            }
        ).map(
            function(pair) {
                const [_id, _bool] = pair;
                return document.getElementById(_id);
            }
        ).filter(
            function(element) {
                return element != null;
            }
        ).forEach(
            function(element) {
                if (element._message_handler != null) {
                    return element._message_handler.call(element, topic, payload);
                }
            }
        );
    }

    register_all_consumers() {
        var messenger = this;

        Array.from(document.querySelectorAll("*")).filter(
            function(element) {
                return (
                    element != null &&
                    element.getAttribute("listener") != null &&
                    element.getAttribute("consume") != null
                );
            }
         )
        .forEach(
            function(element) {
                messenger.setElementHandler(element);
                messenger.setElementTopics(element);

                if (element.emit == null) {
                    element.emit = function(topic, payload) {
                        messenger.broadcast(topic, payload);
                    }
                }
            }
        );
    }

    //=========================================================
    //                Element Message Handling
    //=========================================================
    setElementHandler(element) {
        var code = element.getAttribute("listener");

        if (code == "" || code == "null") {
            element._message_handler = new Function("return;");
        }
        else if (window[code] != null) {
            element._message_handler = window[code];
        }
        else if (code.search(";") == -1) {
            element._message_handler = new Function("topic", "payload", code + ".call(this, topic, payload);");
        }
        else {
            element._message_handler = new Function("topic", "payload", code);
        }
    }

    setElementTopics(element) {
        var messenger = this;

        (element.getAttribute("consume") || "").
        split(",").
        map(
            function(term) {
                return term.trim();
            }
        ).
        forEach(
            function(topic) {
                messenger.register(element, topic);
            }
        );
    }

    //=========================================================
    //                      Events
    //=========================================================
    connectedCallback() {
        var self = this;

        setTimeout(
            function() {
                self.register_all_consumers();
            },

            1000
        );

        this.hide();
    }
}

customElements.define(uiMessenger.tagname.toLowerCase(), uiMessenger);