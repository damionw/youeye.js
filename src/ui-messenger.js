class uiMessenger extends uiBase {
    constructor() {
        super();

        this.idcount = 0;

        this._registrations = {
        };
    }

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

    register(element, topic) {
        if (topic in {null: 0, "": 0, "null": 0}) {
            return;
        }

        if (element.id in {null: 0, "": 0}) {
            element.id = "ui_messaging_" + this.idcount++;
        }

        var topic = topic.toLowerCase();

        if (this._registrations[topic] == null) {
            this._registrations[topic] = {};
        }

        this._registrations[topic][element.id] = 1;

        console.log("REGISTER: topic=" + topic + " elements=" + Object.keys(this._registrations[topic]).join(",") + "]");
    }

    deregister(element, topic) {
        if (element.id in {null: 0, "": 0}) {
            return;
        }

        var topic = topic.toLowerCase();

        if (this._registrations[topic] == null) {
            return;
        }

        if (! (topic in this._registrations)) {
            return;
        }

        this._registrations[topic][element.id] == 0;
    }

    broadcast(topic, payload) {
        var topic = topic.toLowerCase();

        var registered_elements = Object.entries(this._registrations[topic] || {}).filter(
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

    report() {
        var l = Object.entries(this._registrations).map(
            function(p1) {
                return Object.entries(p1[1]).map(
                    function(p2) {
                        return [
                            p1[0],
                            p2[0],
                            p2[1],
                        ].join("|");
                    }
                );
            }
        );

        console.log("REPORT: " + l.join("\n"));
    }

    connectedCallback() {
        this.style.display = "none";
    }
}

customElements.define(uiMessenger.tagname.toLowerCase(), uiMessenger);