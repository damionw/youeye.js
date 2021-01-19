class uiFrame extends uiBase {
    static get tagname() {
        return "UI-FRAME";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiBase.defaultAttributes, {
                "background": "default",
                "foreground": "default",
                "orientation": "vertical",
                "width": "100%",
                "height": "100%",
                "pad": "false",
                "justify": "left",
                "show": "true",
            }
        );
    }

    constructor() {
        super();

        // Start observing the target node for configured mutations
        this.observer.observe(this, this.observer_config);
    }

    get visible_mode() {
        return "inline-flex";
    }

    get hidden_mode() {
        return "none";
    }

    get unpadded() {
        return 0;
    }

    get verticallyOriented() {
        return (this.getAttribute("orientation") == "vertical");
    }

    get padded() {
        return (this.getAttribute("pad") == "true");
    }

    get styled_children() {
        return Array.from(this.childNodes).filter(
            function(elem) {
                return (elem.style != null);
            }
        );
    }

    show(showing) {
        if (showing) {
            this.style.display = this.visible_mode;
        }
        else {
            this.style.display = this.hidden_mode;
        }
    }

    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var vertically_arranged = this.verticallyOriented;
        var style_elements = this.styled_children;

        for (var i=0; i < style_elements.length; ++i){
            var elem = style_elements[i];
            var is_lastelement = (i >= (style_elements.length - 1));

            var flex_attribute = (
                vertically_arranged ? elem.style.height : elem.style.width
            );

            elem.style.flex = (
                flex_attribute[flex_attribute.length - 1] == "%" ?
                "1 1 0px" :
                ("0 0 " + flex_attribute)
            );

            if (is_lastelement) {
            }
            else if (! this.padded) {
            }
            else if (elem.unpadded) {
                // Element is immune from padding
            }
            else if (vertically_arranged) {
                elem.style.marginBottom = padding_value;
            }
            else {
                elem.style.marginRight = padding_value;
            }
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute("width");
        }
        else if (name == "height") {
            this.style.height = this.getAttribute("height");
        }
        else if (name == "show" && oldValue != newValue) {
            this.show(this.getAttribute(name) == "true");
        }
        else if (name == "background") {
            this.style.backgroundColor = (
                this.getAttribute("background") == "default" ?
                this.configuration.getAttribute("application_background") :
                this.getAttribute("background")
            );
        }
        else if (name == "foreground") {
            this.style.color = (
                this.getAttribute("foreground") == "default" ?
                this.configuration.getAttribute("application_foreground") :
                this.getAttribute("foreground")
            );
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
        this.style.position = "relative"; // DEBUG

        this.initAttributes();
        this.setTopics();
    }
}

customElements.define(uiFrame.tagname.toLowerCase(), uiFrame);