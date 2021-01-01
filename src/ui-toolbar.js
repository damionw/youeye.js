class uiToolBar extends uiBase {
    constructor() {
        super();

        // Start observing the target node for configured mutations
        this.observer.observe(this, this.observer_config);
    }

    static get tagname() {
        return "UI-TOOLBAR";
    }

    static get defaultAttributes() {
        return {
            "consume": null,
            "listener": null,
            "background": null,
            "width": "100%",
            "height": null,
        };
    }

    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var style_elements = [];

        for (var i=0; i < this.childNodes.length; ++i){
            var elem = this.childNodes[i];

            if (elem.style != null) {
                style_elements.push(elem);
            }
        }

        for (var i=0; i < style_elements.length; ++i){
            var elem = style_elements[i];
            var flex_attribute = elem.style.width;

            elem.style.flex = (
                flex_attribute[flex_attribute.length - 1] == "%" ?
                "1 1 0px" :
                ("0 0 " + flex_attribute)
            );

            elem.style.height = "100%";
            elem.style.margin = "2px";
        }
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
        this.setDefaults();

        if (this.parentNode.nodeName == "BODY") {
            this.parentNode.style.height = "100vh";
            this.parentNode.style.width = "100%";
            this.parentNode.style.margin = "0px";
            this.parentNode.style.padding = "0px";
            this.parentNode.parentNode.style.height = "100vh";
            this.parentNode.parentNode.style.margin = "0px";
            this.parentNode.parentNode.style.padding = "0px";
        }

        this.style.display = "inline-flex";
        this.style.boxSizing = "border-box";
        this.style.margin = "0px";
        this.style.flexDirection = "row";

        this.initAttributes();
        this.setTopics();
    }
}

customElements.define(uiToolBar.tagname.toLowerCase(), uiToolBar);