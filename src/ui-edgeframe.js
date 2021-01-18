class uiEdgePanel extends uiFrame {
    static get tagname() {
        return "UI-EDGEPANEL";
    }

    constructor() {
        super();
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes, {
                "orientation": "vertical",
                "width": "auto",
                "height": "auto",
                "show": "false",
                "edge": "left",
            }
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "edge") {
            var edge = this.getAttribute(name);
            var width = this.getAttribute("width");
            var height = this.getAttribute("height");

            if (edge == "left") {
                this.style.left = 0;
                this.style.right = "auto";
                this.style.top = 0;
                this.style.bottom = "auto";
                this.style.width = width;
                this.style.height = "100%";
            }
            else if (edge == "right") {
                this.style.left = "auto";
                this.style.right = 0;
                this.style.top = 0;
                this.style.bottom = "auto";
                this.style.width = width;
                this.style.height = "100%";
            }
            else if (edge == "top") {
                this.style.left = 0;
                this.style.right = "auto";
                this.style.top = 0;
                this.style.bottom = "auto";
                this.style.width = "100%";
                this.style.height = height;
            }
            else if (edge == "bottom") {
                this.style.left = 0;
                this.style.right = "auto";
                this.style.top = "auto";
                this.style.bottom = 0;
                this.style.width = "100%";
                this.style.height = height;
            }
        }
        else {
            uiFrame.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        uiFrame.prototype.connectedCallback.call(this);

        this.style.boxShadow = "0px 0px 12px " + this.alterRGB(
            this.style.backgroundColor,
            -64
        );

        this.style.borderRadius = "2px";
        this.style.top = this.configuration.getAttribute("toolbar_height");
        this.style.overflow = "auto";
        this.style.position = "absolute";

        this.show(0);
    }
}

customElements.define(uiEdgePanel.tagname.toLowerCase(), uiEdgePanel);