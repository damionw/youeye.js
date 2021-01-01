class uiBase extends HTMLElement {
    constructor() {
        super();

        this._observer = null;
    }

    get observer_config() {
        // Options for the observer (which mutations to observe)
        return {
            // attributes: true,
            // subtree: true,
            childList: true
        };
    }

    get observer() {
        if (this._observer == null) {
            var self = this;

            // Create an observer instance linked to the callback function
            this._observer = new MutationObserver(
                function(mutationsList, observer) {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            self.elementsChanged(mutation.addedNodes);
                        }
                    }
                }
            );
        }

        return this._observer;
    }

    static get defaultAttributes() {
        return {
        };
    }

    static get observedAttributes() {
        return Object.keys(this.defaultAttributes);
    }

    get configuration() {
        return uiConfiguration.singleton;
    }

    get messenger() {
        return uiMessenger.singleton;
    }

    send(topic, payload) {
        console.log("SEND MESSAGE: " + topic + " -> " + payload);
        this.messenger.broadcast(topic, payload);
    }

    receive(topic, payload) {
        console.log("GOT MESSAGE: " + topic + " -> " + payload);
    }

    setTopics() {
        var topics = (this.getAttribute("listen") || "").split(",");

        for (var i=0; i < topics.length; ++i) {
            this.messenger.register(this, topics[i]);
        }
    }

    elementsChanged(newElements) {
    }

    connectedCallback() {
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) {
    }

    setDefaults() {
        var attribute_entries = Object.entries(this.constructor.defaultAttributes);

        for (var i=0; i < attribute_entries.length; ++i) {
            const [attribute_name, default_value] = attribute_entries[i];

            if (! this.hasAttribute(attribute_name)) {
                this.setAttribute(attribute_name, default_value);
            }
        }
    }

    initAttributes() {
        var attribute_collection = this.constructor.observedAttributes;

        for (var i=0; i < attribute_collection.length; ++i) {
            var attribute_name = attribute_collection[i];
            this.attributeChangedCallback(attribute_name);
        }
    }

    alterRGB(rgb, amt) {
        const [r, g, b] = this.rgbStrVal(rgb).map(
            function(color) {
                return Math.min(255, Math.max(0, color + amt));
            }
        );

        return this.rgbToHex(r, g, b);
    }

    rgbStrVal(rgb){
        return rgb.substr(0, rgb.length - 1).substr(4).split(",").map(
            function(v){return parseInt(v.trim());}
        );
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static attachSingleton(element) {
        var search_elements = document.getElementsByTagName("BODY");

        for (var i=0; i < search_elements.length; ++i) {
            var parent_node = search_elements[i];
            parent_node.appendChild(element);
            return element;
        }

        throw new Error("No BODY element found in document");
    }
}
