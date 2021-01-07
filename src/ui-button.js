class uiButton extends uiBase {
    static get tagname() {
        return "UI-BUTTON";
    }

    constructor() {
        super();
    }

    static get defaultAttributes() {
        return Object.assign(
            uiBase.defaultAttributes, {
                "foreground": "inherit",
                "background": "inherit",
                "highlight": 16,
                "width": "auto",
                "height": "default",
                "emit": "",
            }
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute("width");
        }
        else if (name == "height") {
            this.style.height = (
                this.getAttribute("height") == "default" ?
                this.configuration.getAttribute("toolbar_height") :
                this.getAttribute("height")
            );
        }
        else if (name == "background") {
            this.style.backgroundColor = this.getAttribute("background");
        }
        else if (name == "foreground") {
            this.style.color = this.getAttribute("foreground");
        }
        else if (name == "highlight") {
        }
        else {
            uiBase.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        var self = this;

        this.setDefaults();

        this.style.display = "block";
        this.style.boxSizing = "border-box";
        this.style.padding = "4px";
        this.style.borderRadius = this.border_radius;
        this.style.fontFamily = this.configuration.getAttribute("application_typeface");
        this.style.fontSize = this.configuration.getAttribute("application_typesize");

        this.initAttributes();
        this.setTopics();

        this.addEventListener("mouseover", function(ev){self.mouseoverCallback(ev);});
        this.addEventListener("mouseout", function(ev){self.mouseoutCallback(ev);});
        this.addEventListener("click", function(ev){self.mouseclickCallback(ev);});
    }

    mouseoverCallback(ev) {
        this.attributeChangedCallback("background");

        this.style.cursor = "pointer";

        this.style.backgroundColor = (
            this.alterRGB(
                window.getComputedStyle(this).backgroundColor,
                parseInt(this.getAttribute("highlight"))
            )
        );
    }

    mouseoutCallback(ev) {
        this.attributeChangedCallback("background");
        this.attributeChangedCallback("foreground");
        this.style.cursor = "default";
    }

    mouseclickCallback(ev) {
        var topic = this.getAttribute("emit");

        if (topic.length && topic != "null") {
            this.emit(topic, null);
        }
    }
}

customElements.define(uiButton.tagname.toLowerCase(), uiButton);