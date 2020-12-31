'use strict';

class Pane extends HTMLElement {
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
            "foreground": null,
            "background": null,
            "width": "100%",
            "height": "100%",
        };
    }

    static get observedAttributes() {
        return Object.keys(this.defaultAttributes);
    }

    get configuration() {
        return window.ConfigurationSettings.activeConfiguration;
    }

    elementsChanged(newElements) {
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
        var padding_value = this.configuration.getAttribute("padding");
        var self = this;

        this.setDefaults();

        this.style.display = "block";
        this.style.boxSizing = "border-box";
        this.style.padding = padding_value;
        this.style.margin = "0px";
        this.style.boxShadow = "3px 3px 10px " + this.configuration.alterRGB(this.parentNode.style.backgroundColor, -64);
        this.style.borderRadius = "8px";

        this.constructor.observedAttributes.forEach(
            function(_attr) {
                self.attributeChangedCallback(_attr);
            }
        );
    }

    disconnectedCallback() {
    }
}

customElements.define("ui-pane", Pane);