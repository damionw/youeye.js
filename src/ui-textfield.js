class uiTextField extends uiBase {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-TEXTFIELD";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiBase.defaultAttributes, {
                "foreground": "inherit",
                "background": "inherit",
                "width": "auto",
                "height": "default",
                "confirmedsignal": "",
                "cancelledsignal": "",
            }
        );
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();

        var shadow = this.attachShadow({mode: 'open'});
        var div = document.createElement('div');

        div.contentEditable = "true";

        div.style.width = "100%";
        div.style.height = "100%";
        div.style.color = "inherit";
        div.style.backgroundColor = "inherit";
        div.style.fontFamily = "inherit";
        div.style.cursor = "inherit";

        shadow.appendChild(div);
    }

    //=========================================================
    //                     Transitions
    //=========================================================
    highlight(on) {
        var shadow_depth = this.configuration.getAttribute("shadow_depth");

        if (on) {
            this.style.boxShadow = "3px 3px " + shadow_depth + " " + this.alterRGB(
                this.style.backgroundColor,
                -64
            );
        }
        else {
            this.style.boxShadow = "none";
        }
    }

    //=========================================================
    //                    Object Properties
    //=========================================================
    get visible_mode() {
        return "block";
    }

    get editor_element() {
        return this.shadowRoot.childNodes[0];
    }

    get text() {
        return this.editor_element.textContent;
    }

    //=========================================================
    //                         Events
    //=========================================================
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute(name);
        }
        else if (name == "height") {
            this.style.height = (
                this.getAttribute(name) == "default" ?
                this.configuration.getAttribute("toolbar_height") :
                this.getAttribute(name)
            );
        }
        else if (name == "background") {
            this.style.backgroundColor = this.getAttribute(name);
        }
        else if (name == "foreground") {
            this.style.color = this.getAttribute(name);
        }
        else if (name == "enabled") {
            this.attributeChangedCallback("background");

            if (this.booleanAttribute(name)) {
                this.editor_element.contentEditable = "true";
                this.style.cursor = "text";
            }
            else {
                this.editor_element.contentEditable = "false";
                this.style.cursor = "pointer";

                this.style.backgroundColor = this.alterRGB(
                    window.getComputedStyle(this).backgroundColor,
                    parseInt(this.getAttribute("background"))
                );
            }
        }
        else {
            uiBase.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        var self = this;

        this.setDefaults();

        this.style.display = "block";
        this.margin = "4px";
        this.style.boxSizing = "border-box";
        this.style.borderRadius = this.configuration.getAttribute("border_radius");
        this.style.fontFamily = this.configuration.getAttribute("application_typeface");
        this.style.fontSize = this.configuration.getAttribute("application_typesize");

        this.initAttributes();
        this.setTopics();
        this.highlight(0);

        this.editor_element.addEventListener("focus", function(ev){self.focusEnterCallback(ev);});
        this.editor_element.addEventListener("blur", function(ev){self.focusExitCallback(ev);});
        this.editor_element.addEventListener("keydown", function(ev){self.keyPressCallback(ev);});

        uiBase.prototype.connectedCallback.call(this);
    }

    keyPressCallback(ev) {
        if (event.keyCode == 13) {
            this._emit_event("confirmedsignal", this.text);
        }
        else if (event.keyCode == 27) {
            this._emit_event("cancelledsignal", this.text);
        }

        uiBase.prototype.keyPressCallback.call(this, ev);
    }

    focusEnterCallback(ev) {
        this.highlight(1);
        uiBase.prototype.focusEnterCallback.call(this, ev);
    }

    focusExitCallback(ev) {
        this.highlight(0);
        uiBase.prototype.focusExitCallback.call(this, ev);
    }
}

customElements.define(uiTextField.tagname.toLowerCase(), uiTextField);