class uiToolBar extends uiFrame {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-TOOLBAR";
    }

    static get defaultAttributes() {
        return Object.assign(
            {}, uiFrame.defaultAttributes, {
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
//     elementsChanged(newElements) {
//         var padding_value = this.configuration.getAttribute("padding");
//         var style_elements = this.styled_children;
// 
//         for (var i=0; i < style_elements.length; ++i){
//             var elem = style_elements[i];
// 
//             elem.style.height = "auto";
//             elem.style.margin = padding_value;
//         }
//     }
// 
    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var style_elements = this.styled_children;

        for (var i=0; i < style_elements.length; ++i){
            var elem = style_elements[i];
            var is_lastelement = (i >= (style_elements.length - 1));
            var is_firstelement = (i == 0);
            var flex_attribute = elem.style.width;

            elem.style.flex = (
                flex_attribute.endsWith("%") || flex_attribute.endsWith("vh") ?
                "1 1 0px" :
                ("0 0 " + flex_attribute)
            );

            if (this.padded && ! elem.unpadded) {
//                 elem.style.margin = 0;

                elem.style.marginRight = (is_lastelement ? padding_value : 0);
                elem.style.marginLeft = padding_value;
                elem.style.marginTop = padding_value;
                elem.style.marginBottom = padding_value;
            }
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
