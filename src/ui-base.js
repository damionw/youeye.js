class uiBase extends HTMLElement {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-BASE";
    }

    static get defaultAttributes() {
        return {
            "consume": null,
            "listener": null,
            "enabled": "true",
            "pressedsignal": "",
            "releasedsignal": "",
            "clickedsignal": "",
            "hoversignal": "",
            "exitsignal": "",
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
        // Options for the observer (select which DOM mutations to observe)
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

    get visible_mode() {
        return this.hidden_mode;
    }

    get hidden_mode() {
        return "none";
    }

    get styled_children() {
        return Array.from(this.childNodes).filter(
            function(elem) {
                return (elem.style != null);
            }
        );
    }

    //=========================================================
    //                Message Handling
    //=========================================================
    emit(topic, payload) {
        this.messenger.broadcast(topic, payload);
    }

    setTopics() {
        this.messenger.setElementTopics(this);
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
                this.messenger.setElementTopics(this);
            }
            else if (attribute_name == "listener") {
                this.messenger.setElementHandler(this);
            }
            else {
                this.attributeChangedCallback(attribute_name);
            }
        }
    }

    //=========================================================
    //                      Events
    //=========================================================
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "show") {
            this.setVisibility(this.booleanAttribute(name));
        }
    }

    connectedCallback() {
        var self = this;

        this.addEventListener("mouseover", function(ev){self.mouseoverCallback(ev);});
        this.addEventListener("mouseout", function(ev){self.mouseoutCallback(ev);});
        this.addEventListener("mousedown", function(ev){self.mousedownCallback(ev);});
        this.addEventListener("mouseup", function(ev){self.mouseupCallback(ev);});
        this.addEventListener("click", function(ev){self.mouseclickCallback(ev);});
        this.addEventListener("focus", function(ev){self.focusEnterCallback(ev);});
        this.addEventListener("blur", function(ev){self.focusExitCallback(ev);});
        this.addEventListener("keydown", function(ev){self.keyPressCallback(ev);});
    }

    elementsChanged(newElements) {
    }

    disconnectedCallback() {
    }

    mouseclickCallback(ev) {
        this._emit_event("clickedsignal", ev);
    }

    mousedownCallback(ev) {
        this._emit_event("pressedsignal", ev);
    }

    mouseupCallback(ev) {
        this._emit_event("releasedsignal", ev);
    }

    mouseoverCallback(ev) {
        this._emit_event("hoversignal", ev);
    }

    mouseoutCallback(ev) {
        this._emit_event("exitsignal", ev);
    }

    focusEnterCallback(ev) {
        this._emit_event("focussignal", ev);
    }

    focusExitCallback(ev) {
        this._emit_event("blursignal", ev);
    }

    keyPressCallback(ev) {
        this._emit_event("keysignal", ev);
    }

    _emit_event(attribute_name, event) {
        var topic = this.getAttribute(attribute_name);

        if (topic != null && topic.length && topic != "null") {
            this.emit(topic, event);
        }
    }

    //=========================================================
    //                     Transitions
    //=========================================================
    setVisibility(showing) {
        if (showing && this.style.display != this.visible_mode) {
            this.style.display = this.visible_mode;
        }
        else if ((! showing) && this.style.display != this.hidden_mode) {
            this.style.display = this.hidden_mode;
        }
    }

    show() {
        this.setAttribute("show", "true");
    }

    hide() {
        this.setAttribute("show", "false");
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

    //=========================================================
    //                    Conversions
    //=========================================================
    booleanAttribute(name) {
        var value = this.getAttribute(name);

        return (
            value != null && value.toLowerCase() == "true"
        );
    }
}
