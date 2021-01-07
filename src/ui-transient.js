class uiTransient extends uiFrame {
    static get tagname() {
        return "UI-TRANSIENT";
    }

    constructor() {
        super();
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes, {
                "orientation": "vertical",
                "relative": "true",
                "width": "auto",
                "height": "auto",
                "show": "false",
                "x": "30px",
                "y": "30px",
            }
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "x") {
            this.style.left = this.getAttribute(name);
        }
        else if (name == "y") {
            this.style.top = this.getAttribute(name);
        }
        else if (name == "relative") {
            this.style.position = (
                this.getAttribute(name) == "true" ?
                "absolute" :
                "fixed"
            );
        }
        else {
            uiFrame.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        uiFrame.prototype.connectedCallback.call(this);

        this.style.boxShadow = "3px 3px 10px " + this.alterRGB(
            this.style.backgroundColor,
            -64
        );

        this.style.borderRadius = "4px";
    }
}

customElements.define(uiTransient.tagname.toLowerCase(), uiTransient);