class uiForm extends uiPane {
    //=========================================================
    //                    Class Attributes
    //=========================================================
    static get tagname() {
        return "UI-FORM";
    }

    static get defaultAttributes() {
        return Object.assign(
            {}, uiBase.defaultAttributes, {
                "normal_foreground": "inherit",
                "normal_background": "inherit",
                "width": "100%",
                "height": "100%",
            }
        );
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();

        var shadow = this.attachShadow({mode: 'open'});

        var table_pane = this._table_pane = document.createElement('table');
        var column_group = document.createElement('colgroup');
        var left_column = document.createElement('col');
        var right_column = document.createElement('col');

        left_column.style.width = "20%";
        left_column.style.backgroundColor = "beige";

        right_column.style.width = "100%";
        right_column.style.backgroundColor = "white";

        table_pane.style.width = "100%";
        table_pane.style.height = "100%";
        table_pane.style.backgroundColor = "black";
        table_pane.style.color = "inherit";

        column_group.appendChild(left_column);
        column_group.appendChild(right_column);
        table_pane.appendChild(column_group);
        shadow.appendChild(table_pane);
    }

    //=========================================================
    //                   Object attributes
    //=========================================================
//     get panes() {
//         if (! this._panes.length) {
//             var left = document.createElement('div');
//
//             left.style.flex = "0 0 20%";
//             left.style.display = "block";
//             left.style.boxSizing = "border-box";
//             left.style.border = "2px solid blue"; // DEBUG
//
//             this.appendChild(left);
//             this._panes.push(left);
//
//             var right = document.createElement('div');
//
//             right.style.flex = "1 1 30px";
//             right.style.display = "block";
//             right.style.boxSizing = "border-box";
//             right.style.border = "2px solid red"; // DEBUG
//
//             this.appendChild(right);
//             this._panes.push(right);
//         }
//
//         return this._panes;
//     }
//
//     get left_pane() {
//         return this.panes[0];
//     }
//
//     get right_pane() {
//         return this.panes[1];
//     }

//     get visible_mode() {
//         return "block";
//     }

    //=========================================================
    //                         Events
    //=========================================================
    elementsChanged(newElements) {
        var mytable = this._table_pane;

        for (var i=0; i < newElements.length; ++i) {
            var element = newElements[i];
            var get_attribute_function = element.getAttribute;

            if (get_attribute_function == null) {
                continue;
            }

            console.log("HERE: " + element.nodeName + " of " + newElements.length);

            var labeltext = element.getAttribute("form-label");

            if (labeltext == null || labeltext == "") {
                continue;
            }

            var new_row = mytable.insertRow(-1);

            var left_cell =  new_row.insertCell(0);
            var right_cell =  new_row.insertCell(1);

            console.log("FORM ENTRY: " + element.tagName + " = " + labeltext);

            left_cell.innerHTML = labeltext;
            right_cell.appendChild(element);

            continue; // DEBUG
/*
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
            }*/
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

        uiBase.prototype.connectedCallback.call(this);
    }
}

customElements.define(
    uiForm.tagname.toLowerCase(),
    uiForm
);
