class uiToolBar extends uiFrame {
    constructor() {
        super();
    }

    static get tagname() {
        return "UI-TOOLBAR";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes(), {
                "orientation": "column",
                "width": "100%",
                "height": "default",
                "pad": true,
            }
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "height") {
            this.style.height = (
                this.getAttribute("height") == "default" ?
                this.configuration.getAttribute("toolbar_height") :
                this.getAttribute("height")
            );
        }
        else {
            uiFrame.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }
}

customElements.define(uiToolBar.tagname.toLowerCase(), uiToolBar);