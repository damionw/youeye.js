class uiBase extends HTMLElement {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-BASE";
    }

    static get defaultAttributes() {
        return {
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

    static get signalAttributes() {
        return Object.keys(this.defaultAttributes).filter(
            function(_name) {
                return (_name.indexOf("signal") > -1);
            }
        ).sort();
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
    //               Attribute Manipulation
    //=========================================================
    getConfigAttribute(attribute_name, configuration_name) {
        var attribute_value = this.getAttribute(attribute_name);

        // Only default or null element attribute values will permit consultation of
        // the configuration scheme singleton !!!
        if (! (attribute_value == "default" || attribute_value == null || attribute_value == ""))
            return attribute_value;
        else if (configuration_name == null || configuration_name == "")
            return this.configuration.getAttribute(attribute_name);
        else 
            return this.configuration.getAttribute(configuration_name);
    }

    //=========================================================
    //                   Initializing
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
            this.attributeChangedCallback(attribute_name);
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
        var _topic = this.getAttribute(attribute_name);

        if (_topic != null && _topic.length && _topic != "null") {
            this.emit(_topic, event);
        }
    }

    emit(topic, payload) {
        // We can only use emit() if pubber has been enabled
        if (typeof(pubsubMessageRouter) == "undefined") {
            return;
        }

        pubsubMessageRouter.singleton.emit(topic, payload);
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
