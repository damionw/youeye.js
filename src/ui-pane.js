class uiPane extends uiBase {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-PANE";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes, {
                "foreground": "inherit",
                "background": "inherit",
                "width": "100%",
                "height": "100%",
            }
        );
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();

        // Start observing the target node for configured mutations
        this.observer.observe(this, this.observer_config);
    }

    //=========================================================
    //                    Object Properties
    //=========================================================
    get visible_mode() {
        return "inline-block";
    }

    get unpadded() {
        return 0;
    }

    //=========================================================
    //                         Events
    //=========================================================
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute("width");
        }
        else if (name == "height") {
            this.style.height = this.getAttribute("height");
        }
        else if (name == "background") {
            this.style.backgroundColor = this.getAttribute("background");
        }
        else if (name == "foreground") {
            this.style.color = this.getAttribute("foreground");
        }
        else {
            uiBase.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        var padding_value = this.configuration.getAttribute("padding");
        var shadow_depth = this.configuration.getAttribute("shadow_depth");
        var border_radius = this.configuration.getAttribute("border_radius");

        this.setDefaults();

        this.style.display = "block";
        this.style.boxSizing = "border-box";
        this.style.padding = padding_value;
        this.style.margin = "0px";
        this.style.overflow = "auto";

        this.style.boxShadow = "3px 3px " + shadow_depth + " " + this.alterRGB(
            this.style.backgroundColor,
            -64
        );

        this.style.borderRadius = border_radius;
        this.initAttributes();
        this.setTopics();

        this.show();
    }
}

customElements.define(uiPane.tagname.toLowerCase(), uiPane);