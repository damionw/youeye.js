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
        return {
            "listen": null,
            "foreground": null,
            "background": null,
            "width": "100%",
            "height": "100%",
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        var self = this;

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

    connectedCallback() {
        var padding_value = this.configuration.getAttribute("padding");

        this.setDefaults();

        this.style.display = "block";
        this.style.boxSizing = "border-box";
        this.style.padding = padding_value;
        this.style.margin = "0px";
        this.style.boxShadow = "3px 3px 10px " + this.configuration.alterRGB(this.parentNode.style.backgroundColor, -64);
        this.style.borderRadius = "8px";

        this.initAttributes();
        this.setTopics();
    }
}

customElements.define(uiPane.tagname.toLowerCase(), uiPane);