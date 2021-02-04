class uiCanvas extends uiBase {
    //=========================================================
    //                    Class Attributes
    //=========================================================
    static get tagname() {
        return "UI-CANVAS";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiBase.defaultAttributes, {
                "normal_foreground": "inherit",
                "normal_background": "inherit",
                "drawing_width": "600",
                "drawing_height": "480",
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

        var shadow = this.attachShadow({mode: 'open'});
        var canvas = this._canvas = document.createElement('canvas')

        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.backgroundColor = "inherit";
        canvas.style.color = "inherit";

        shadow.appendChild(canvas);
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get canvas() {
        return this._canvas;
    }

    getContext(type) {
        return this.canvas.getContext(type);
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
        else if (name == "drawing_width") {
            this.canvas.width = this.getAttribute(name);
        }
        else if (name == "drawing_height") {
            this.canvas.height = this.getAttribute(name);
        }
        else if (name == "normal_background") {
            this.style.backgroundColor = this.getConfigAttribute(name, "application_background");
        }
        else if (name == "normal_foreground") {
            this.style.Color = this.getConfigAttribute(name, "application_foreground");
        }
        else {
            uiBase.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        this.setDefaults();

        this.style.display = "block";
        this.style.boxSizing = "border-box";

        this.initAttributes();
        this.setTopics();

        uiBase.prototype.connectedCallback.call(this);
    }

    mousedownCallback(ev) {
        uiBase.prototype.mousedownCallback.call(this, ev);
    }

    mouseupCallback(ev) {
        uiBase.prototype.mouseupCallback.call(this, ev);
    }

    mouseoverCallback(ev) {
        uiBase.prototype.mouseoverCallback.call(this, ev);
    }

    mouseoutCallback(ev) {
        uiBase.prototype.mouseoutCallback.call(this, ev);
    }

    mouseclickCallback(ev) {
        uiBase.prototype.mouseclickCallback.call(this, ev);
    }
}

customElements.define(uiCanvas.tagname.toLowerCase(), uiCanvas);