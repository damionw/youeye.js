class uiButton extends uiBase {
    static get tagname() {
        return "UI-BUTTON";
    }

    constructor() {
        super();
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes, {
                "foreground": "inherit",
                "background": "inherit",
                "highlight": 16,
                "width": "auto",
                "height": "default",
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
        this.style.padding = "2px";
        this.style.marginTop = "2px";
        this.style.borderRadius = "8px";

        this.initAttributes();
        this.setTopics();

        this.addEventListener("mouseover", function(ev){self.mouseoverCallback(ev);});
        this.addEventListener("mouseout", function(ev){self.mouseoutCallback(ev);});
        this.addEventListener("click", function(ev){self.mouseclickCallback(ev);});
    }

    mouseoverCallback(ev) {
        this.attributeChangedCallback("background");

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
    }

    mouseclickCallback(ev) {
        this.emit("one", "this is a test"); // DEBUG
    }
}

customElements.define(uiButton.tagname.toLowerCase(), uiButton);