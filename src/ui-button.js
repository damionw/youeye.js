class uiButton extends uiBase {
    constructor() {
        super();
    }

    static get tagname() {
        return "UI-BUTTON";
    }

    static get defaultAttributes() {
        return {
            "consume": null,
            "listener": null,
            "foreground": null,
            "background": null,
            "highlight": 16,
            "width": "100%",
            "height": null,
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute("width");
        }
        else if (name == "height") {
            this.style.height = (
                this.getAttribute("height") in {"null": 0, null: 0} ?
                this.configuration.getAttribute("button_height") :
                this.getAttribute("height")
            );
        }
        else if (name == "background") {
            this.style.backgroundColor = (
                this.getAttribute("background") in {"null": 0, null: 0} ?
                this.configuration.getAttribute("application_background") :
                this.getAttribute("background")
            );
        }
        else if (name == "foreground") {
            this.style.color = (
                this.getAttribute("foreground") in {"null": 0, null: 0} ?
                this.configuration.getAttribute("application_foreground") :
                this.getAttribute("foreground")
            );
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
        this.send("one", "this is a test"); // DEBUG
    }
}

customElements.define(uiButton.tagname.toLowerCase(), uiButton);