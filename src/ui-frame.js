class uiFrame extends uiBase {
    static get tagname() {
        return "UI-FRAME";
    }

    constructor() {
        super();

        // Start observing the target node for configured mutations
        this.observer.observe(this, this.observer_config);
    }

    static get defaultAttributes() {
        return Object.assign(
            uiBase.defaultAttributes, {
                "background": "default",
                "foreground": "default",
                "orientation": "row",
                "width": "100%",
                "height": "100%",
                "pad": "false",
                "justify": "left",
                "show": "true",
            }
        );
    }

    get rowOriented() {
        return (this.getAttribute("orientation") == "row");
    }

    get columnOriented() {
        return (this.getAttribute("orientation") == "columnar");
    }

    get padded() {
        return (this.getAttribute("pad") == "true");
    }

    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var row_oriented = this.rowOriented;
        var style_elements = [];

        for (var i=0; i < this.childNodes.length; ++i){
            var elem = this.childNodes[i];

            if (elem.style != null) {
                style_elements.push(elem);
            }
        }

        for (var i=0; i < style_elements.length; ++i){
            var elem = style_elements[i];

            var flex_attribute = (
                row_oriented ? elem.style.height : elem.style.width
            );

            elem.style.flex = (
                flex_attribute[flex_attribute.length - 1] == "%" ?
                "1 1 0px" :
                ("0 0 " + flex_attribute)
            );

            if (row_oriented) {
                elem.style.width = "100%";
            }
            else {
                elem.style.height = "100%";
            }

            elem.style.margin = "0px";

            if (this.padded && i < (style_elements.length - 1)) {
                elem.style.marginBottom = padding_value;
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
        else if (name == "show") {
            this.style.display = (
                this.getAttribute(name) == "true" ?
                "inline-flex" :
                "none"
            );
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
            this.style.padding = (
                this.padded ?
                this.configuration.getAttribute("padding") :
                "0px"
            );
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
        this.style.flexDirection = (this.rowOriented ? "column" : "row");

        this.initAttributes();
        this.setTopics();
    }
}

customElements.define(uiFrame.tagname.toLowerCase(), uiFrame);