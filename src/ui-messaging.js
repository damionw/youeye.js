'use strict';

class MessageHandling extends HTMLElement {
    constructor() {
        super();

        this.idcount = 0;

        this.registrations = {
        };
    }

    register(element, topic) {
        if (topic == null) {
            return;
        }

        if (element.id in {null: 0, "": 0}) {
            element.id = "ui_messaging_" + this.idcount++;
        }

        var topic = topic.toLowerCase();

        if (! (topic in this.registrations)) {
            this.registrations[topic] = {};
        }

        this.registrations[topic][element.id] == 1;

        console.log("REGISTER: " + topic + "[" + Object.keys(this.registrations[topic]).join(",") + "]");
    }

    deregister(element, topic) {
        if (element.id in {null: 0, "": 0}) {
            return;
        }

        var topic = topic.toLowerCase();

        if (! (topic in this.registrations)) {
            return;
        }

        this.registrations[topic][element.id] == 0;
    }

    send(topic, payload) {
        console.log("SEND; " + topic);

        var topic = topic.toLowerCase();

        if (! (topic in this.registrations)) {
            return;
        }

        var elements = Object.entries(this.registrations[topic]).filter(
            function(pair) {
                const [element_id, boolean] = pair;
                console.log("OH: " + element_id + " " + boolean);
                return boolean;
            }
        ).map(
            function(pair) {
                const [element_id, boolean] = pair;
                return document.getElementById(element_id);
            }
        ).filter(
            function(element) {
                element != null;
            }
        ).forEach(
            function(element) {
                console.log("WHAT: " + element.id + " " + element.receive);

                if (element.receive != null) {
                    element.receive(topic, payload);
                }
            }
        );
    }

    static get messaging() {
        var elements = document.getElementsByTagName("UI-MESSAGING");

        for (var i=0; i < elements.length; ++i) {
            return elements[i];
        }

        return document.createElement("UI-MESSAGING");
    }

    connectedCallback() {
        var self = this;

        this.style.display = "none";

        this.constructor.observedAttributes.forEach(
            function(_attr) {
                self.attributeChangedCallback(_attr);
            }
        );
    }

    static get observedAttributes() {
        return [];
    }
}

window.MessageHandling = MessageHandling;
customElements.define("ui-messaging", MessageHandling);