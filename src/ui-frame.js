'use strict';

class Frame extends HTMLElement {
    constructor() {
        super();

        // Options for the observer (which mutations to observe)
        const config = {
            // attributes: true,
            // subtree: true,
            childList: true
        };

        var self = this;

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(
            function(mutationsList, observer) {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        self.elementsChanged(mutation.addedNodes);
                    }
                }
            }
        );

        // Start observing the target node for configured mutations
        observer.observe(this, config);
    }

    static get defaultAttributes() {
        return {
            "background": null,
            "orientation": "row",
            "width": "100%",
            "height": "100%",
            "pad": "false",
        };
    }

    static get observedAttributes() {
        return Object.keys(this.defaultAttributes);
    }

    get rowOriented() {
        return (this.getAttribute("orientation") == "row");
    }

    get columnOriented() {
        return (this.getAttribute("orientation") == "columnar");
    }

    get padded() {
        return (this.getAttribute("pad") == "true");
    }

    get configuration() {
        return window.ConfigurationSettings.activeConfiguration;
    }

    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var row_oriented = this.rowOriented;
        var style_elements = [];

        for (var i=0; i < this.childNodes.length; ++i){
            var elem = this.childNodes[i];

            if (elem.style != null) {
                style_elements.push(elem);
            }
        }

        for (var i=0; i < style_elements.length; ++i){
            var elem = style_elements[i];

            var flex_attribute = (
                row_oriented ? elem.style.height : elem.style.width
            );

            elem.style.flex = (
                flex_attribute[flex_attribute.length - 1] == "%" ?
                "1 1 0px" :
                ("0 0 " + flex_attribute)
            );

            if (row_oriented) {
                elem.style.width = "100%";
            }
            else {
                elem.style.height = "100%";
            }

            elem.style.margin = "0px";

            if (this.padded && i < (style_elements.length - 1)) {
                elem.style.marginBottom = padding_value;
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute("width");
        }
        else if (name == "height") {
            this.style.height = this.getAttribute("height");
        }
        else if (name == "background") {
            this.style.backgroundColor = (
                this.getAttribute("background") in {"null": 0, null: 0} ?
                this.configuration.getAttribute("application_background") :
                this.getAttribute("background")
            );
        }
        else if (name == "foreground") {
            this.style.color = (
                this.getAttribute("foreground") in {"null": 0, null: 0} ?
                this.configuration.getAttribute("application_foreground") :
                this.getAttribute("foreground")
            );
        }
        else if (name == "pad") {
            this.style.padding = (
                this.padded ?
                this.configuration.getAttribute("padding") :
                "0px"
            );
        }
        else if (name == "orientation") {
            this.elementsChanged([]);
        }
    }

    setDefaults() {
        var self = this;

        Object.entries(this.constructor.defaultAttributes).forEach(
            function(pair) {
                const [attribute_name, default_value] = pair;

                if (!self.hasAttribute(attribute_name)) {
                    self.setAttribute(attribute_name, default_value);
                }
            }
        );
    }

    connectedCallback() {
        var self = this;

        this.setDefaults();

        if (this.parentNode.nodeName == "BODY") {
            this.parentNode.style.height = "100vh";
            this.parentNode.style.width = "100%";
            this.parentNode.style.margin = "0px";
            this.parentNode.style.padding = "0px";
            this.parentNode.parentNode.style.height = "100vh";
            this.parentNode.parentNode.style.margin = "0px";
            this.parentNode.parentNode.style.padding = "0px";
        }

        this.style.display = "inline-flex";
        this.style.boxSizing = "border-box";
        this.style.margin = "0px";
        this.style.flexDirection = (this.rowOriented ? "column" : "row");

        this.constructor.observedAttributes.forEach(
            function(_attr) {
                self.attributeChangedCallback(_attr);
            }
        );
    }

    disconnectedCallback() {
    }
}

customElements.define("ui-frame", Frame);