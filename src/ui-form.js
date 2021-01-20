class uiForm extends uiBase {
    //=========================================================
    //                    Class Attributes
    //=========================================================
    static get tagname() {
        return "UI-FORM";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiBase.defaultAttributes, {
                "foreground": "inherit",
                "background": "inherit",
                "width": "auto",
                "height": "default",
                "emit": "",
            }
        );
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();

        this._panels = [];

        // Start observing the target node for configured mutations
        this.observer.observe(this, this.observer_config);
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get panes() {
        if (! this._panels.length) {
            var left = document.createElement('div');
            var right = document.createElement('div');

            left.style.display = "none";
            left.style.width = "auto";
            left.style.height = "auto";
            left.style.color = "black";
            left.style.backgroundColor = "inherit";
            left.style.boxSizing = "border-box";
            left.style.padding = "3px";
            left.style.margin = "2px";
            left.style.border = "2px solid blue"; // DEBUG

            this.appendChild(left);
            this.appendChild(right);

            this._panels.append(left);
            this._panels.append(right);
        }

        return this._panels;
    }

    get left_pane() {
        return this.panels[0];
    }

    get right_pane() {
        return this.panels[1];
    }

    //=========================================================
    //                         Events
    //=========================================================
    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var vertically_arranged = this.verticallyOriented;
        var style_elements = this.styled_children;

        for (var i=0; i < style_elements.length; ++i){
        }
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
            this.style.backgroundColor = this.getAttribute(name);
        }
        else if (name == "foreground") {
            this.style.color = this.getAttribute(name);
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
        this.style.flexDirection = "row";
        this.style.position = "relative";

        this.initAttributes();
        this.setTopics();
    }
}

customElements.define(uiForm.tagname.toLowerCase(), uiForm);