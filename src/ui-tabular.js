class uiTabular extends uiBase {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-TABULAR";
    }

    static get defaultAttributes() {
        return Object.assign(
            {}, uiFrame.defaultAttributes, {
                "normal_foreground": "default",
                "normal_background": "default",
                "disabled_foreground": "default",
                "disabled_background": "default",
                "selected_foreground": "default",
                "selected_background": "default",
                "highlight_foreground": "default",
                "highlight_background": "default",
                "width": "100%",
                "height": "100%",
                "data": JSON.stringify(this.defaultContent),
            }
        );
    }

    static get defaultContent() {
        return {
            "columns": ["1"],

            "values": [
                []
            ]
        };
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();

        var shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(this._table_element = document.createElement('table'));
    }

    //=========================================================
    //                    Object Properties
    //=========================================================
    get visible_mode() {
        return "block";
    }

    get rowCount() {
        return this._data.values.length || 0;
    }

    get columnCount() {
        return this._data.columns.length || 0;
    }

    get table_element() {
        return this._table_element;
    }

    get data() {
        return this._data;
    }

    set data(data) {
        if (data == null || data.length == 0) {
            data = this.defaultContent;
        }

        if (Array.isArray(data)) {
            data = {
                columns: null,
                values: data
            };
        }

        if (! Array.isArray(data.values)) {
            data.values = [[]];
        }
        else if (! Array.isArray(data.values[0])) {
            data.values = [data.values];
        }

        var columnCount = (data.values[0] || []).length;

        if (data.columns == null) {
            data.columns = Array.from(Array(columnCount).keys());
        }

        this._data = data;

        this.formatShadowElement();
    }

    //=========================================================
    //                       Transitions
    //=========================================================
    formatShadowElement(data) {
        var highlight_foreground = this.getConfigAttribute("highlight_foreground");
        var highlight_background = this.getConfigAttribute("highlight_background");
        var table_element = this.table_element;
        var labels = this.data.columns;
        var rowdata = this.data.values;

        table_element.innerHTML = "";

        for (var y=-1; y < this.rowCount; ++y) {
            var row_element = document.createElement('tr');

            for (var x=0; x < this.columnCount; ++x) {
                var cell_element = (
                    y == -1 ?
                    document.createElement('th') :
                    document.createElement('td')
                );

                cell_element.innerHTML = (
                    y == -1 ?
                    labels[x] :
                    rowdata[y][x]
                );

                cell_element.style.backgroundColor = (
                    y == -1 ?
                    highlight_background :
                    "inherit"
                );

                cell_element.style.color = (
                    y == -1 ?
                    highlight_foreground :
                    "inherit"
                );

                this.registerCell(cell_element, x, y);

                row_element.appendChild(cell_element);
            }

            table_element.appendChild(row_element);
        }

        table_element.style.tableLayout = "fixed";
        table_element.style.backgroundColor = "inherit";
        table_element.style.color = "inherit";
        table_element.style.margin = "2px";
        table_element.style.padding = "0px";
    }

    registerCell(cell_element, x, y) {
        var self = this;
        cell_element.addEventListener("mouseover", function(ev){self.mouseoverCallback(cell_element, x, y);});
        cell_element.addEventListener("mouseout", function(ev){self.mouseoutCallback(cell_element, x, y);});
        cell_element.addEventListener("click", function(ev){self.mouseclickCallback(cell_element, x, y);});
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
        else if (name == "normal_background") {
            this.style.backgroundColor = this.getConfigAttribute(name, "application_background");
        }
        else if (name == "normal_foreground") {
            this.style.color = this.getConfigAttribute(name, "application_foreground");
        }
        else if (name == "selected_background") {
        }
        else if (name == "selected_foreground") {
        }
        else if (name == "highlight_background") {
        }
        else if (name == "highlight_foreground") {
        }
        else if (name == "disabled_background") {
        }
        else if (name == "disabled_foreground") {
        }
        else if (name == "data") {
            this.data = JSON.parse(this.getAttribute(name));
        }
        else {
            uiBase.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        var padding_value = this.configuration.getAttribute("padding");

        this.setDefaults();
        this.style.fontFamily = this.configuration.getAttribute("application_typeface");
        this.style.fontSize = this.configuration.getAttribute("application_typesize");
        this.table_element.style.margin = padding_value;
        this.initAttributes();
        this.show();
    }

    mouseclickCallback(cell_element, x, y) {
//         this._emit_event("cellselection_signal", this._dates[cell_index]);
    }

    mouseoverCallback(cell_element, x, y) {
//             this._emit_event("cellhovered_signal", date);
    }

    mouseoutCallback(cell_element, x, y) {
//             this._emit_event("cellexited_signal", date);
    }
}

customElements.define(uiTabular.tagname.toLowerCase(), uiTabular);
