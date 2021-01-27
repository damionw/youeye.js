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
                "hover": "false",
                "decorate": "false",
                "relative": "true",
                "width": "auto",
                "height": "auto",
                "show": "false",
                "x": "0px",
                "y": "0px",
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
        else if (name == "decorate") {
            var border_radius = this.configuration.getAttribute("border_radius");
            var shadow_depth = this.configuration.getAttribute("shadow_depth");

            if (this.booleanAttribute(name)) {
                this.style.boxShadow = "0px 0px " + shadow_depth + " " + this.alterRGB(
                    this.style.backgroundColor,
                    -64
                );

                this.style.borderRadius = border_radius;
            } else {
                this.style.boxShadow = "auto";
                this.style.borderRadius = "0px";
            }
        }
        else if (name == "hover") {
        }
        else if (name == "relative") {
            if (this.booleanAttribute(name)) {
                this.style.position = "absolute";
            }
            else {
                this.style.position = "fixed";
            }
        }
        else {
            uiFrame.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        uiFrame.prototype.connectedCallback.call(this);

        this.style.zIndex = 1;
        this.style.top = this.parentNode.clientHeight;
        this.style.overflow = "auto";
        this.hide();
    }

    mouseoverCallback(ev) {
        uiFrame.prototype.mouseoverCallback.call(this, ev);

        if (this.booleanAttribute("hover")) {
            this.show();
        }
    }

    mouseoutCallback(ev) {
        uiFrame.prototype.mouseoutCallback.call(this, ev);

        if (this.booleanAttribute("hover")) {
            this.hide();
        }
    }
}

customElements.define(uiTransient.tagname.toLowerCase(), uiTransient);