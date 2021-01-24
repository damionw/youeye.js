class uiTransient extends uiFrame {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-TRANSIENT";
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

    constructor() {
        super();
    }

    //=========================================================
    //                    Object Properties
    //=========================================================
    get visible_mode() {
        return "inline-block";
    }

    get unpadded() {
        return 1;
    }

    //=========================================================
    //                         Events
    //=========================================================
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
        var shadow_depth = this.configuration.getAttribute("shadow_depth");

        uiFrame.prototype.connectedCallback.call(this);

        this.style.boxShadow = "0px 0px " + shadow_depth + " " + this.alterRGB(
            this.style.backgroundColor,
            -64
        );

        this.style.borderRadius = "4px";
        this.style.zIndex = 1;
        this.style.top = this.parentNode.clientHeight; // this.configuration.getAttribute("toolbar_height");
        this.style.overflow = "auto";
//         this.style.maxWidth = "90%";
//         this.style.maxHeight = "90%";

        this.hide();
    }

    mouseoverCallback(ev) {
        uiFrame.prototype.mouseoverCallback.call(this, ev);
        this.show();
    }

    mouseoutCallback(ev) {
        uiFrame.prototype.mouseoutCallback.call(this, ev);
        this.hide();
    }

}

customElements.define(uiTransient.tagname.toLowerCase(), uiTransient);