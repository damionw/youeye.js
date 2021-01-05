class uiToolBar extends uiFrame {
    constructor() {
        super();
    }

    static get tagname() {
        return "UI-TOOLBAR";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes, {
                "orientation": "column",
                "width": "100%",
                "height": "default",
                "pad": true,
            }
        );
    }

    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var style_elements = [];

        for (var i=0; i < this.childNodes.length; ++i){
            var elem = this.childNodes[i];

            if (elem.style == null) {
                continue;
            }

            elem.style.margin = "0px";
            elem.style.marginTop = padding_value;
            elem.style.marginLeft = padding_value;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "height") {
            this.style.height = (
                this.getAttribute("height") == "default" ?
                this.configuration.getAttribute("toolbar_height") :
                this.getAttribute("height")
            );
        }
        else {
            uiFrame.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }
}

customElements.define(uiToolBar.tagname.toLowerCase(), uiToolBar);