class uiCalendar extends uiBase {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-CALENDAR";
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes, {
                "foreground": "inherit",
                "background": "inherit",
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
        var table_element = document.createElement('table');
        table_element.style.tableLayout = "fixed";
        table_element.innerHTML = this.calendar_definition;
        shadow.appendChild(table_element);
    }

    //=========================================================
    //                    Object Properties
    //=========================================================
    get calendar_definition() {
        var output = this.header_definition;

        for (var i=0; i < this.rows; ++i) {
            output = output + this.row_definition;
        }

        return output;
    }

    get rows() {
        return 5;
    }

    get columns() {
        return 7;
    }

    get header_definition() {
        return '<th style="background: yellow; width: 20px">' + this.field_definition + "</th>"
    }

    get row_definition() {
        return '<tr style="background: white;">' + this.field_definition + "</tr>"
    }

    get field_definition() {
        var output = "";

        for (var i=0; i < this.columns; ++i) {
            output = output + this.cell_definition;
        }

        return output;
    }

    get cell_definition() {
        return "<td></td>";
    }

    get visible_mode() {
        return "block";
    }

    get unpadded() {
        return 0;
    }

    get table_element() {
        return this.shadowRoot.childNodes[0];
    }

    //=========================================================
    //                         Events
    //=========================================================
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.style.width = this.getAttribute(name);
        }
        else if (name == "height") {
            this.style.height = this.getAttribute(name);
        }
        else if (name == "background") {
            this.style.backgroundColor = this.getAttribute(name);
        }
        else if (name == "foreground") {
            this.style.color = this.getAttribute(name);
        }
        else if (name == "date") {
        }
        else {
            uiBase.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        var padding_value = this.configuration.getAttribute("padding");

        this.setDefaults();

        this.style.boxSizing = "border-box";
        this.style.border = "2px solid blue"; // DEBUG
        this.style.padding = padding_value;
        this.style.margin = "0px";
        this.style.overflow = "hidden";

        this.initAttributes();
        this.setTopics();

        this.show();
    }
}

customElements.define(uiCalendar.tagname.toLowerCase(), uiCalendar);