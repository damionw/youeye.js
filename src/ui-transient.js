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
                "orientation": "row",
                "width": "auto",
                "height": "auto",
                "show": "false",
                "x": 100px,
                "y": 100px,
            }
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "x") {
            this.style.left = this.getAttribute("x");
        }
        else if (name == "y") {
            this.style.top = this.getAttribute("y");
        }
        else {
            uiFrame.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        uiFrame.prototype.connectedCallback.call(this);

        this.style.position = "fixed";
    }
}

customElements.define(uiTransient.tagname.toLowerCase(), uiTransient);