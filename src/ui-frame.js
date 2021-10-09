class uiFrame extends uiBase {
    //=========================================================
    //                    Class Attributes
    //=========================================================
    static get tagname() {
        return "UI-FRAME";
    }

    static get defaultAttributes() {
        return Object.assign(
            {}, uiBase.defaultAttributes, {
                "normal_background": "inherit",
                "normal_foreground": "inherit",
                "orientation": "vertical",
                "width": "100%",
                "height": "100%",
                "pad": "false",
                "justify": "left",
                "show": "true",
            }
        );
    }

    //=========================================================
    //                      Constructor
    //=========================================================
    constructor() {
        super();

        // Start observing the target node for configured mutations
        this.observer.observe(this, this.observer_config);
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get visible_mode() {
        return "inline-flex";
    }

    get unpadded() {
        return 0;
    }

    get padded() {
        return (this.booleanAttribute("pad"));
    }

    get verticallyOriented() {
        return (this.getAttribute("orientation") == "vertical");
    }

    //=========================================================
    //                       Events
    //=========================================================
    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var vertically_arranged = this.verticallyOriented;
        var style_elements = this.styled_children;

        for (var i=0; i < style_elements.length; ++i){
            var elem = style_elements[i];
            var is_lastelement = (i >= (style_elements.length - 1));
            var is_firstelement = (i == 0);

            var flex_attribute = (
                vertically_arranged ? elem.style.height : elem.style.width
            );

            elem.style.flex = (
                flex_attribute.endsWith("%") || flex_attribute.endsWith("vh") ?
                "1 1 0px" :
                ("0 0 " + flex_attribute)
            );

            if (this.padded && ! elem.unpadded) {
                elem.style.margin = 0;

                if (this.verticallyOriented) {
                    elem.style.marginBottom = (is_lastelement ? padding_value : 0);
                    elem.style.marginTop = padding_value;
//                     elem.style.marginLeft = padding_value;
//                     elem.style.marginRight = padding_value;
                }
                else {
                    elem.style.marginRight = (is_lastelement ? padding_value : 0);
                    elem.style.marginLeft = padding_value;
//                     elem.style.marginTop = padding_value;
//                     elem.style.marginBottom = padding_value;
                }
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute(name);
        }
        else if (name == "height") {
            this.style.height = this.getAttribute(name);
        }
        else if (name == "normal_background") {
            this.style.backgroundColor = this.getConfigAttribute(name, "application_background");
        }
        else if (name == "normal_foreground") {
            this.style.color = this.getConfigAttribute(name, "application_foreground");
        }
        else if (name == "pad") {
            this.elementsChanged();
        }
        else if (name == "orientation") {
            this.elementsChanged([]);
        }
        else if (name == "justify") {
            var justification = this.getAttribute(name);

            this.style.alignItems = "safe stretch";

            if (justification == "left" || justification == "top") {
                this.style.justifyContent = "safe flex-start";
            }
            else if (justification == "right" || justification == "bottom") {
                this.style.justifyContent = "safe flex-end";
            }
            else if (justification == "center" || justification == "middle") {
                this.style.justifyContent = "safe center";
            }
        }
        else {
            uiBase.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
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
        this.style.flexDirection = (this.verticallyOriented ? "column" : "row");
        this.style.position = "relative";

        this.initAttributes();

        uiBase.prototype.connectedCallback.call(this);
    }
}

customElements.define(uiFrame.tagname.toLowerCase(), uiFrame);
