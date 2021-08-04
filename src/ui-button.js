class uiButton extends uiBase {
    //=========================================================
    //                    Class Attributes
    //=========================================================
    static get tagname() {
        return "UI-BUTTON";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiBase.defaultAttributes, {
                "normal_foreground": "inherit",
                "normal_background": "inherit",
                "disabled_foreground": "default",
                "disabled_background": "default",
                "highlight": 48,
                "tooltip": "",
                "width": "auto",
                "height": "default",
            }
        );
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();
        this._tooltip = null;
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get tooltip() {
        if (this._tooltip == null) {
            var div = document.createElement('div');

            div.style.display = "none";
            div.style.width = "auto";
            div.style.height = "auto";
            div.style.color = this.getConfigAttribute("normal_foreground", "application_foreground");
            div.style.backgroundColor = this.getConfigAttribute("normal_background", "application_background");
            div.style.fontFamily = "inherit";
            div.style.fontSize = "12px";
            div.style.cursor = "inherit";
            div.style.boxSizing = "border-box";
            div.style.padding = "3px";
            div.style.margin = "2px";

            this.appendChild(div);

            this._tooltip = div;
        }

        return this._tooltip;
    }

    //=========================================================
    //                         Events
    //=========================================================
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute(name);
        }
        else if (name == "height") {
            this.style.height = this.getConfigAttribute(name, "toolbar_height");
        }
        else if (name == "normal_background") {
            this.style.backgroundColor = this.getConfigAttribute(name, "application_background");
        }
        else if (name == "normal_foreground") {
            this.style.Color = this.getConfigAttribute(name, "application_foreground");
        }
        else if (name == "highlight") {
        }
        else if (name == "tooltip") {
            this.tooltip.textContent = this.getAttribute(name);
        }
        else {
            uiBase.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        this.setDefaults();

        this.style.display = "block";
        this.style.boxSizing = "border-box";
        this.style.position = "relative";
        this.style.padding = "3px";
        this.style.margin = "0px";
        this.style.marginLeft = "6px";
        this.style.marginRight = "6px";
        this.style.borderRadius = this.configuration.getAttribute("border_radius");
        this.style.fontFamily = this.configuration.getAttribute("application_typeface");
        this.style.fontSize = this.configuration.getAttribute("application_typesize");

        this.initAttributes();

        uiBase.prototype.connectedCallback.call(this);
    }

    mousedownCallback(ev) {
        var shadow_color = this.alterRGB(
            window.getComputedStyle(this).backgroundColor,
            -64
        );

        var inset = "3px 3px 2px 10px " + shadow_color + " inset";

        this.style.WebkitBoxShadow = inset;
        this.style.boxShadow = inset;

        uiBase.prototype.mousedownCallback.call(this, ev);
    }

    mouseupCallback(ev) {
        this.style.WebkitBoxShadow = "none";
        this.style.boxShadow = "none";

        uiBase.prototype.mouseupCallback.call(this, ev);
    }

    mouseoverCallback(ev) {
        this.attributeChangedCallback("background");
        this.style.cursor = "pointer";

        if (this.getAttribute("tooltip") != "") {
            var tooltip = this.tooltip;

            tooltip.style.display = "flex";
            tooltip.style.flexDirection = "row";
            tooltip.style.position = "absolute";
            tooltip.style.left = "5px";
            tooltip.style.top = "30px"; // this.configuration.toolbar_height;
            tooltip.style.width = "auto";
            tooltip.style.backgroundColor = "rgba(255,255,255,0.65)";
            tooltip.style.color = "green";
            tooltip.style.zIndex = 1;
        }

        this.style.backgroundColor = this.alterRGB(
            window.getComputedStyle(this).backgroundColor,
            parseInt(this.getAttribute("highlight"))
        );

        uiBase.prototype.mouseoverCallback.call(this, ev);
    }

    mouseoutCallback(ev) {
        this.attributeChangedCallback("normal_background");
        this.attributeChangedCallback("normal_foreground");
        this.tooltip.style.display = "none";
        this.style.cursor = "default";

        uiBase.prototype.mouseoutCallback.call(this, ev);
    }

    mouseclickCallback(ev) {
        uiBase.prototype.mouseclickCallback.call(this, ev);
    }
}

customElements.define(uiButton.tagname.toLowerCase(), uiButton);