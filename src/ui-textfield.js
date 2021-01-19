class uiTextField extends uiBase {
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
                "emit": "",
            }
        );
    }

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

    get editor_element() {
        return this.shadowRoot.childNodes[0];
    }

    get text() {
        return this.editor_element.textContent;
    }

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

            if (this.getAttribute(name) == "true") {
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
        this.style.borderRadius = this.border_radius;
        this.style.fontFamily = this.configuration.getAttribute("application_typeface");
        this.style.fontSize = this.configuration.getAttribute("application_typesize");

        this.initAttributes();
        this.setTopics();

        this.editor_element.addEventListener("keydown", function(ev){self.keyPressCallback(ev);});
    }

    keyPressCallback(event) {
        if (event.keyCode == 13) {
            var topic = this.getAttribute("emit");

            if (topic.length && topic != "null") {
                this.emit(topic, this.text);
            }
        }
    }
}

customElements.define(uiTextField.tagname.toLowerCase(), uiTextField);