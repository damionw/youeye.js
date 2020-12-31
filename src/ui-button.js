'use strict';

class Button extends HTMLElement {
    constructor() {
        super();
    }

    static get defaultAttributes() {
        return {
            "foreground": null,
            "background": null,
            "highlight": 16,
            "width": "100%",
            "height": null,
        };
    }

    static get observedAttributes() {
        return Object.keys(this.defaultAttributes);
    }

    get configuration() {
        return window.ConfigurationSettings.activeConfiguration;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute("width");
        }
        else if (name == "highlight") {
        }
        else if (name == "height") {
            this.style.height = (
                this.getAttribute("height") in {"null": 0, null: 0} ?
                this.configuration.getAttribute("button_height") :
                this.getAttribute("height")
            );
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
        var self = this;

        this.setDefaults();

        this.style.display = "block";
        this.style.boxSizing = "border-box";
        this.style.padding = "2px";
        this.style.marginTop = "2px";
        this.style.borderRadius = "8px";

        this.constructor.observedAttributes.forEach(
            function(_attr) {
                self.attributeChangedCallback(_attr);
            }
        );

        this.addEventListener("mouseover", function(ev){self.mouseoverCallback(ev);});
        this.addEventListener("mouseout", function(ev){self.mouseoutCallback(ev);});
        this.addEventListener("click", function(ev){self.mouseclickCallback(ev);});
    }

    disconnectedCallback() {
    }

    mouseoverCallback(ev) {
        this.attributeChangedCallback("background");

        this.style.backgroundColor = (
            this.configuration.alterRGB(
                window.getComputedStyle(this).backgroundColor,
                parseInt(this.getAttribute("highlight"))
            )
        );
    }

    mouseoutCallback(ev) {
        this.attributeChangedCallback("background");
        this.attributeChangedCallback("foreground");
    }

    mouseclickCallback(ev) {
        console.log("CLICKED " + this.childNodes[0].html); // DEBUG
        MessageHandling.messaging.send("one", "this is a test"); // DEBUG
    }
}

customElements.define("ui-button", Button);