class uiToolBar extends uiFrame {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-TOOLBAR";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes, {
                "orientation": "horizontal",
                "width": "100%",
                "height": "default",
                "pad": true,
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
    //                         Events
    //=========================================================
    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var style_elements = this.styled_children;

        for (var i=0; i < style_elements.length; ++i){
            var elem = style_elements[i];

            elem.style.height = "auto";
            elem.style.margin = padding_value;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "height") {
            this.style.height = this.getConfigAttribute(name, "toolbar_height");
        }
        else {
            uiFrame.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        uiFrame.prototype.connectedCallback.call(this);
    }
}

customElements.define(uiToolBar.tagname.toLowerCase(), uiToolBar);