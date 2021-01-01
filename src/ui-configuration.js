class uiConfiguration extends uiBase {
    static get tagname() {
        return "UI-CONFIGURATION";
    }

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

    static get singleton() {
        var elements = document.getElementsByTagName(this.tagname);

        for (var i=0; i < elements.length; ++i) {
            return elements[i];
        }

        console.log ("Creating new " + self.tagname);
        return this.attachSingleton(document.createElement(this.tagname));
    }

    connectedCallback() {
        this.setDefaults();
        this.style.display = "none";
        this.initAttributes();
    }
}

customElements.define(uiConfiguration.tagname.toLowerCase(), uiConfiguration);