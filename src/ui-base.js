class uiBase extends HTMLElement {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get defaultAttributes() {
        return {
            "consume": null,
            "listener": null,
            "enabled": "true",
        };
    }

    static get observedAttributes() {
        return Object.keys(this.defaultAttributes);
    }

    //=========================================================
    //                      Class Methods
    //=========================================================
    static attachSingleton(element) {
        var search_elements = document.getElementsByTagName("BODY");

        for (var i=0; i < search_elements.length; ++i) {
            var parent_node = search_elements[i];
            parent_node.appendChild(element);
            return element;
        }

        throw new Error("No BODY element found in document");
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();

        this._message_handler = null;
        this._observer = null;
    }

    //=========================================================
    //                    Object Properties
    //=========================================================
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

    get configuration() {
        return uiConfiguration.singleton;
    }

    get messenger() {
        return uiMessenger.singleton;
    }

    //=========================================================
    //                Message Handling
    //=========================================================
    emit(topic, payload) {
        this.messenger.broadcast(topic, payload);
    }

    receive(topic, payload) {
        if (this._message_handler != null) {
            return this._message_handler.call(this, topic, payload);
        }
    }

    //=========================================================
    //                Message Routing
    //=========================================================
    setMessageHandler() {
        var code = this.getAttribute("listener");

        if (code == "" || code == "null") {
            this._message_handler = new Function("return;");
        }
        else if (window[code] != null) {
            this._message_handler = window[code];
        }
        else if (code.search(";") == -1) {
            this._message_handler = new Function("topic", "payload", code + ".call(this, topic, payload);");
        }
        else {
            this._message_handler = new Function("topic", "payload", code);
        }
    }

    setTopics() {
        var self = this;

        (this.getAttribute("consume") || "").
        split(",").
        map(
            function(term) {
                return term.trim();
            }
        ).
        forEach(
            function(topic) {
                self.messenger.register(self, topic);
            }
        );
    }

    //=========================================================
    //                      Initializing
    //=========================================================
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

            if (attribute_name == "consume") {
                this.setTopics();
            }
            else if (attribute_name == "listener") {
                this.setMessageHandler();
            }
            else {
                this.attributeChangedCallback(attribute_name);
            }
        }
    }

    //=========================================================
    //                      Events
    //=========================================================
    elementsChanged(newElements) {
    }

    connectedCallback() {
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) {
    }

    //=========================================================
    //                 Color Manipulation
    //=========================================================
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
}
