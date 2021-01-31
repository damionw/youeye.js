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
                "normal_foreground": "inherit",
                "normal_background": "inherit",
                "width": "auto",
                "height": "default",
            }
        );
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();

        this._panes = [];

        // Start observing the target node for configured mutations
        this.observer.observe(this, this.observer_config);
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
    get panes() {
        if (! this._panes.length) {
            var left = document.createElement('div');

            left.style.flex = "0 0 20%";
            left.style.display = "block";
            left.style.boxSizing = "border-box";
            left.style.border = "2px solid blue"; // DEBUG

            this.appendChild(left);
            this._panes.push(left);

            var right = document.createElement('div');

            right.style.flex = "1 1 30px";
            right.style.display = "block";
            right.style.boxSizing = "border-box";
            right.style.border = "2px solid red"; // DEBUG

            this.appendChild(right);
            this._panes.push(right);
        }

        return this._panes;
    }

    get left_pane() {
        return this.panes[0];
    }

    get right_pane() {
        return this.panes[1];
    }

    get visible_mode() {
        return "block";
    }

    //=========================================================
    //                         Events
    //=========================================================
    elementsChanged(newElements) {
        for (var i=0; i < newElements.length; ++i) {
            var element = newElements[i];
            var label = "";

            if (element == this.left_pane) {
            }
            else if (element == this.right_pane) {
            }
            else if (element.nodeType == 3) {
                this.left_pane.appendChild(element);
                this.right_pane.appendChild(document.createElement("div"));
            }
            else if (element.hasAttribute("label")) {
                this.left_pane.appendChild(document.createTextNode(element.getAttribute("label")));
                this.right_pane.appendChild(element);
            }
            else {
                this.left_pane.appendChild(document.createElement("div"));
                this.right_pane.appendChild(element);
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
        this.style.padding = "10px";

        this.initAttributes();
        this.setTopics();

        uiBase.prototype.connectedCallback.call(this);
    }
}

customElements.define(uiForm.tagname.toLowerCase(), uiForm);