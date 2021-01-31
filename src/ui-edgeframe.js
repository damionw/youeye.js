class uiEdgeFrame extends uiFrame {
    //=========================================================
    //                    Class Attributes
    //=========================================================
    static get tagname() {
        return "UI-EDGEFRAME";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes, {
                "orientation": "vertical",
                "normal_background": "default",
                "width": "auto",
                "height": "auto",
                "show": "false",
                "edge": "left",
            }
        );
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get unpadded() {
        return 1;
    }

    //=========================================================
    //                       Transitions
    //=========================================================
    setVisibility(showing) {
        var self = this;
        var edge = this.getAttribute("edge");
        var transform = this.style.transform;
        var scale = 1.0;

        if (transform != "") {
            scale = parseFloat(
                transform.split("(")[1].split(")")[0]
            );
        }

        if (showing) {
            if (scale >= 1.0) {
                return;
            }

            this.style.display = this.visible_mode;
            scale = scale + 0.1;
        }
        else {
            if (scale <= 0.0) {
                this.style.display = this.hidden_mode;
                return;
            }

            this.style.display = this.visible_mode;
            scale = scale - 0.1;
        }

        if (edge == "left") {
            this.style.WebkitTransform = "scaleX(" + scale + ")";
            this.style.transform = "scaleX(" + scale + ")";
            this.style.transformOrigin = "0% 100%";
        }
        else if (edge == "right") {
            this.style.WebkitTransform = "scaleX(" + scale + ")";
            this.style.transform = "scaleX(" + scale + ")";
            this.style.transformOrigin = "100% 0%";
        }
        else if (edge == "top") {
            this.style.WebkitTransform = "scaleY(" + scale + ")";
            this.style.transform = "scaleY(" + scale + ")";
            this.style.transformOrigin = "100% 0%";
        }
        else if (edge == "bottom") {
            this.style.WebkitTransform = "scaleY(" + scale + ")";
            this.style.transform = "scaleY(" + scale + ")";
            this.style.transformOrigin = "0% 100%";
        }

        // Schedule the next transition 'pass'
        setTimeout(
            function() {
                self.setVisibility(showing);
            },

            this.configuration.getAttribute("animation_milliseconds")
        );
    }

    //=========================================================
    //                       Events
    //=========================================================
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "edge") {
            var edge = this.getAttribute(name);
            var width = this.getAttribute("width");
            var height = this.getAttribute("height");
            var fullspan = "100%";

            if (edge == "left") {
                this.style.left = 0;
                this.style.right = "auto";
                this.style.top = 0;
                this.style.bottom = 0;
                this.style.width = width;
                this.style.height = fullspan;
                this.setAttribute("orientation", "vertical");
            }
            else if (edge == "right") {
                this.style.left = "auto";
                this.style.right = 0;
                this.style.top = 0;
                this.style.bottom = "auto";
                this.style.width = width;
                this.style.height = fullspan;
                this.setAttribute("orientation", "vertical");
            }
            else if (edge == "top") {
                this.style.left = 0;
                this.style.right = "auto";
                this.style.top = 0;
                this.style.bottom = "auto";
                this.style.width = fullspan;
                this.style.height = height;
                this.setAttribute("orientation", "horizontal");
            }
            else if (edge == "bottom") {
                this.style.left = 0;
                this.style.right = "auto";
                this.style.top = "auto";
                this.style.bottom = 0;
                this.style.width = fullspan;
                this.style.height = height;
                this.setAttribute("orientation", "horizontal");
            }
        }
        else {
            uiFrame.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        uiFrame.prototype.connectedCallback.call(this);

        var shadow_depth = this.configuration.getAttribute("shadow_depth");

        this.style.boxShadow = "3px 3px " + shadow_depth + " " + this.alterRGB(
            this.style.backgroundColor,
            -64
        );

        this.style.borderRadius = "2px";
        this.style.overflow = "auto";
        this.style.position = "absolute";
        this.style.zIndex = 1;

        this.hide();

        uiBase.prototype.connectedCallback.call(this); // Do NOT call uiFrame.connectedCallback() !
    }
}

customElements.define(uiEdgeFrame.tagname.toLowerCase(), uiEdgeFrame);