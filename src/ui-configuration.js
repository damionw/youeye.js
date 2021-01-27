class uiConfiguration extends uiBase {
    //=========================================================
    //                    Class Attributes
    //=========================================================
    static get tagname() {
        return "UI-CONFIGURATION";
    }

    static get defaultAttributes() {
        return {
            "application_background": "#bfbfbf",
            "application_foreground": "blue",
            "application_typeface": "Arial",
            "application_typesize": "18px",
            "border_radius": "4px",
            "animation_milliseconds": 20,
            "shadow_depth": "4px",
            "toolbar_height": "50px",
            "padding": "5px",
        };
    }

    static get singleton() {
        var elements = document.getElementsByTagName(this.tagname);

        for (var i=0; i < elements.length; ++i) {
            return elements[i];
        }

        return this.attachSingleton(document.createElement(this.tagname));
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();
    }

    connectedCallback() {
        this.setDefaults();
        this.style.display = "none";
        this.initAttributes();
    }
}

customElements.define(uiConfiguration.tagname.toLowerCase(), uiConfiguration);