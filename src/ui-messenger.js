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
            function(_element) {
                return _element != null;
            }
        ).forEach(
            function(_element) {
                _element.receive(topic, payload);
            }
        );
    }

    //=========================================================
    //                      Events
    //=========================================================
    connectedCallback() {
        this.style.display = "none";
    }
}

customElements.define(uiMessenger.tagname.toLowerCase(), uiMessenger);