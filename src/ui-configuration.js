'use strict';

class ConfigurationSettings extends HTMLElement {
    constructor() {
        super();
    }

    static get defaultAttributes() {
        return {
            "application_background": "#bfbfbf",
            "application_foreground": "blue",
            "application_typeface": "Arial",
            "application_typesize": "14px",
            "button_height": "50px",
            "padding": "5px",
        };
    }

    static get observedAttributes() {
        return Object.keys(this.defaultAttributes);
    }

    static get activeConfiguration() {
        var elements = document.getElementsByTagName("UI-CONFIGURATION");

        for (var i=0; i < elements.length; ++i) {
            return elements[i];
        }

        return document.createElement("UI-CONFIGURATION");
    }

    attributeChangedCallback(name, oldValue, newValue) {
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
        
        this.style.display = "none";

        this.constructor.observedAttributes.forEach(
            function(_attr) {
                self.attributeChangedCallback(_attr);
            }
        );
    }

    disconnectedCallback() {
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
}

window.ConfigurationSettings = ConfigurationSettings;

customElements.define("ui-configuration", ConfigurationSettings);