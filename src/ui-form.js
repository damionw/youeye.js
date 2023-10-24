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
        var lookup = this._field_lookup = {};

        var column_group = document.createElement('colgroup');
        var left_column = document.createElement('col');
        var right_column = document.createElement('col');

        left_column.style.width = "20%";
        left_column.style.backgroundColor = "inherit";
        left_column.style.padding = "5px";
        left_column.style.borderStyle = "none";
        left_column.style.border = "none";

        right_column.style.width = "100%";
        right_column.style.backgroundColor = "white";
        right_column.style.padding = "5px";
        right_column.style.borderStyle = "none";
        right_column.style.border = "none";

        table_pane.style.width = "100%";
        table_pane.style.height = "100%";
        table_pane.style.backgroundColor = "inherit";
        table_pane.style.color = "inherit";
        table_pane.style.borderStyle = "none";
        table_pane.style.border = "none";
        table_pane.style.borderSpacing = "5px";

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
        var font_family = this.configuration.getAttribute("application_typeface");
        var font_size = this.configuration.getAttribute("application_typesize");

        var mytable = this._table_pane;
        var lookup = this._field_lookup;

        for (var i=0; i < newElements.length; ++i) {
            var form_element = newElements[i];

            if (form_element.getAttribute == null) {
                continue;
            }

            var labeltext = form_element.getAttribute("form-label");

            if (labeltext == null || labeltext == "") {
                continue;
            }

            var entry_name = form_element.getAttribute("name");

            if (entry_name != null) {
                lookup[entry_name] = form_element;
            }

            var new_row = mytable.insertRow(-1);
            var left_cell =  new_row.insertCell(0);
            var right_cell =  new_row.insertCell(1);
            var label_element = document.createElement('div');

            label_element.innerHTML = labeltext;

            left_cell.style.verticalAlign = "top";
            left_cell.style.color = foreground_color;
            left_cell.style.backgroundColor = "inherit";
            left_cell.style.cursor = "inherit";
            left_cell.style.boxSizing = "border-box";
            left_cell.style.padding = "5px";
            left_cell.style.margin = "2px";
            left_cell.style.fontFamily = font_family;
            left_cell.style.fontSize = font_size;
            left_cell.style.paddingLeft = padding_value;
            left_cell.style.paddingRight = padding_value;
            left_cell.style.justifyContent = "center";

            right_cell.style.verticalAlign = "top";
            right_cell.style.borderRadius = border_radius;
            right_cell.style.color = foreground_color;
            right_cell.style.backgroundColor = "inherit";
            right_cell.style.fontFamily = font_family;
            right_cell.style.fontSize = font_size;
            right_cell.style.paddingLeft = padding_value;
            right_cell.style.paddingRight = padding_value;
            right_cell.style.cursor = "inherit";
            right_cell.style.boxSizing = "border-box";
            right_cell.style.padding = "5px";
            right_cell.style.margin = "2px";

            form_element.style.boxShadow = "5px 5px " + shadow_depth + " " + this.alterRGB(
                background_color,
                -64
            );

            new_row.style.height = form_element.style.height;

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
            this._table_pane.style.backgroundColor = "inherit";
        }
        else if (name == "normal_foreground") {
            this.style.color = this.getConfigAttribute(name, "application_foreground");
            this._table_pane.style.foregroundColor = "inherit";
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

    //=========================================================
    //                   Object attributes
    //=========================================================
    get values() {
        var lookup = this._field_lookup;

        if (lookup == null) {
            return {};
        }

        return Object.fromEntries(
            Object.keys(lookup).map(
                function(_key) {
                    var form_element = lookup[_key];
                    var data_attribute = form_element.getAttribute("form-attribute") || "innerText";
//                    return [_key, data_attribute]; // DEBUG
                    return [_key, form_element[data_attribute]];
                }
            )
        );
    }
}

customElements.define(
    uiForm.tagname.toLowerCase(),
    uiForm
);
