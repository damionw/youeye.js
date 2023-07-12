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
        left_column.style.padding = "5px";
        left_column.style.border = "none";

        right_column.style.width = "100%";
        right_column.style.backgroundColor = "white";
        right_column.style.padding = "5px";
        right_column.style.border = "none";

        table_pane.style.width = "100%";
        table_pane.style.height = "100%";
        table_pane.style.backgroundColor = "black";
        table_pane.style.color = "inherit";
        table_pane.style.border = "none";

        column_group.appendChild(left_column);
        column_group.appendChild(right_column);
        table_pane.appendChild(column_group);
        shadow.appendChild(table_pane);
    }

    //=========================================================
    //                         Events
    //=========================================================
    elementsChanged(newElements) {
        var padding_value = this.configuration.getAttribute("padding");
        var shadow_depth = this.configuration.getAttribute("shadow_depth");
        var border_radius = this.configuration.getAttribute("border_radius");
        var foreground_color = this.getConfigAttribute("normal_foreground", "application_foreground");
        var background_color = this.getConfigAttribute("normal_background", "application_background");

        var mytable = this._table_pane;

        for (var i=0; i < newElements.length; ++i) {
            var form_element = newElements[i];

            if (form_element.getAttribute == null) {
                continue;
            }

            var labeltext = form_element.getAttribute("form-label");

            if (labeltext == null || labeltext == "") {
                continue;
            }

            var new_row = mytable.insertRow(-1);
            var left_cell =  new_row.insertCell(0);
            var right_cell =  new_row.insertCell(1);
            var label_element = document.createElement('div');

            label_element.innerHTML = labeltext;

            left_cell.style.verticalAlign = "top";
            left_cell.style.color = foreground_color;
            left_cell.style.backgroundColor = "inherit";
            left_cell.style.fontFamily = "inherit";
            left_cell.style.fontSize = "24px";
            left_cell.style.cursor = "inherit";
            left_cell.style.boxSizing = "border-box";
            left_cell.style.padding = "5px";
            left_cell.style.margin = "2px";

            right_cell.style.verticalAlign = "top";
            right_cell.style.borderRadius = border_radius;
            right_cell.style.color = foreground_color;
            right_cell.style.backgroundColor = "inherit";
            right_cell.style.fontFamily = "inherit";
            right_cell.style.fontSize = "24px";
            right_cell.style.cursor = "inherit";
            right_cell.style.boxSizing = "border-box";
            right_cell.style.padding = "5px";
            right_cell.style.margin = "2px";

            form_element.style.boxShadow = "3px 3px " + shadow_depth + " " + this.alterRGB(
                background_color,
                -64
            );

//             console.log("FORM ENTRY: " + element.tagName + " = " + labeltext);

            left_cell.appendChild(label_element);
            right_cell.appendChild(form_element);
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
