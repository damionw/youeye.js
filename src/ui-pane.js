class uiPane extends uiBase {
    constructor() {
        super();

        // Start observing the target node for configured mutations
        this.observer.observe(this, this.observer_config);
    }

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

        this.setDefaults();

        this.style.display = "block";
        this.style.boxSizing = "border-box";
        this.style.padding = padding_value;
        this.style.margin = "0px";

        this.style.boxShadow = "3px 3px 10px " + this.alterRGB(
            this.style.backgroundColor,
            -64
        );

        this.style.borderRadius = this.border_radius;
        this.initAttributes();
        this.setTopics();
    }
}

customElements.define(uiPane.tagname.toLowerCase(), uiPane);