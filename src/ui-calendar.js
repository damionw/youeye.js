class uiCalendar extends uiBase {
    //=========================================================
    //                    Class Properties
    //=========================================================
    static get tagname() {
        return "UI-CALENDAR";
    }

    static get defaultAttributes() {
        return Object.assign(
            {}, uiFrame.defaultAttributes, {
                "normal_foreground": "inherit",
                "normal_background": "inherit",
                "disabled_foreground": "default",
                "disabled_background": "default",
                "selected_foreground": "default",
                "selected_background": "default",
                "highlight_foreground": "default",
                "highlight_background": "default",
                "width": "100%",
                "height": "100%",
                "date": "",
                "dateselection_signal": "",
                "datehovered_signal": "",
                "dateexited_signal": "",
            }
        );
    }

    //=========================================================
    //                       Constructor
    //=========================================================
    constructor() {
        super();

        this._cells = [];
        this._date = new Date();
        this._dates = [];
        this._resized = false;

        var shadow = this.attachShadow({mode: 'open'});

        shadow.appendChild(this._banner = document.createElement('div'));
        shadow.appendChild(this._table = this.formatShadowElement());
    }

    //=========================================================
    //                    Object Properties
    //=========================================================
    get rowCount() {
        return 7;
    }

    get columnCount() {
        return this.days.length;
    }

    get days() {
        return ["Su","Mo","Tu","We","Th","Fr","Sa"];
    }

    get dates() {
        return this._dates;
    }

    get date() {
        return this._date;
    }

    set date(date_string) {
        if (date_string == null || date_string == "") {
            this._date = new Date();
        }
        else {
            this._date = new Date(date_string);
        }

        this.updateView();
    }

    get visible_mode() {
        return "block";
    }

    get unpadded() {
        return 0;
    }

    get table_element() {
        return this._table;
    }

    //=========================================================
    //                       Transitions
    //=========================================================
    formatShadowElement() {
        var table_element = document.createElement('table');
        var column_width = (100.0 / this.columnCount) + "%";
        var row_height = (100.0 / this.rowCount) + "%";
        var self = this;

        for (var y=0; y < this.rowCount; ++y) {
            var row_element = document.createElement('tr');

            for (var x=0; x < this.columnCount; ++x) {
                var cell_element;

                if (y == 0) {
                    cell_element = document.createElement('th');

                    cell_element.style.width = column_width;
                    cell_element.innerHTML = this.days[x];
                }
                else {
                    var cell_index = this._cells.length;

                    cell_element = document.createElement('td');

                    cell_element.style.textAlign = "right";

                    this.registerCell(cell_element, cell_index);
                    this._cells.push(cell_element);
                    this._dates.push(null);
                }

                cell_element.style.padding = "2px";

                row_element.appendChild(cell_element);
            }

            row_element.style.height = row_height;
            table_element.appendChild(row_element);
        }

        table_element.style.tableLayout = "fixed";
        table_element.style.margin = "0px";
        table_element.style.padding = "0px";

        return table_element;
    }

    registerCell(cell_element, cell_index) {
        var self = this;
        cell_element.addEventListener("mouseover", function(ev){self.mouseoverCallback(cell_index);});
        cell_element.addEventListener("mouseout", function(ev){self.mouseoutCallback(cell_index);});
        cell_element.addEventListener("click", function(ev){self.mouseclickCallback(cell_index);});
    }

    updateView() {
        var cells = this._cells;

        var highlight_foreground = this.getConfigAttribute("highlight_foreground");
        var highlight_background = this.getConfigAttribute("highlight_background");
        var foreground_color = this.getConfigAttribute("normal_foreground", "application_foreground");
        var background_color = this.getConfigAttribute("normal_background", "application_background");
        var selected_foreground = this.getConfigAttribute("selected_foreground");
        var selected_background = this.getConfigAttribute("selected_background");
        var disabled_foreground = this.getConfigAttribute("disabled_foreground");
        var disabled_background = this.getConfigAttribute("disabled_background");

        var current_date = this.date;
        var current_day = current_date.getDate();
        var month_start_date = new Date(current_date.getFullYear(), current_date.getMonth(), 1);
        var first_weekday = month_start_date.getDay();

        var prior_month_end_date = new Date(month_start_date)
        prior_month_end_date.setDate(prior_month_end_date.getDate() - 1);

        var prior_month_last_day = prior_month_end_date.getDate();

        var month_end_date = new Date(month_start_date);
        month_end_date.setMonth(month_end_date.getMonth() + 1);
        month_end_date.setDate(month_end_date.getDate() - 1);

        var last_day_of_month = month_end_date.getDate();
        var index = 0;

        // Highlight table header cells
        Array.from(this.table_element.querySelectorAll("th")).forEach(
            function(cell_element) {
                cell_element.style.backgroundColor = highlight_background;
                cell_element.style.color = highlight_foreground;
            }
        );

        // Disable prior month days
        for (var i=first_weekday; i > 0; --i, ++index) {
            var cell = cells[index];
            var day = (prior_month_last_day + 1) - i;
            cell.innerHTML = day;
            cell.style.backgroundColor = disabled_background;
            cell.style.color = disabled_foreground;
            cell.style.cursor = "auto";
            this._dates[index] = null;
        }

        // Enable current month days and highlight current day
        for (var i=1; i <= last_day_of_month; ++i, ++index) {
            var cell = cells[index];
            var day = i;
            cell.innerHTML = day;
            cell.style.backgroundColor = (day == current_day ? selected_background : background_color);
            cell.style.color = selected_foreground;
            this._dates[index] = new Date(current_date.getFullYear(), current_date.getMonth(), day);
            cell.style.cursor = "pointer";
        }

        // Disable following month days
        for (var day=1; index < cells.length; ++day, ++index) {
            var cell = cells[index];
            cell.innerHTML = day;
            cell.style.backgroundColor = disabled_background;
            cell.style.color = disabled_foreground;
            cell.style.cursor = "auto";
            this._dates[index] = null;
        }

        if (! this._resized) {
            var height = parseInt(window.getComputedStyle(this).height.split("px")[0]);
            var preferred_fontsize = parseInt(height / this.rowCount);
            var banner_fontsize = parseInt(preferred_fontsize - 2);

            this._banner.style.textAlign = "center";
            this.style.fontSize = preferred_fontsize + "px";
            this._banner.style.fontSize = banner_fontsize + "px";

            this._resized = true;
        }

        this._banner.innerHTML = current_date.toLocaleDateString(
            undefined,
            {
                 weekday: 'long',
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric'
            }
        );
    }

    //=========================================================
    //                         Events
    //=========================================================
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "width") {
            this.table_element.style.width = this.style.width = this.getAttribute(name);
        }
        else if (name == "height") {
            this.table_element.style.height = this.style.height = this.getAttribute(name);
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
        else if (name == "date") {
            this.date = this.getAttribute(name);
        }
        else {
            uiBase.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        var padding_value = this.configuration.getAttribute("padding");

        this.setDefaults();
        this.style.fontFamily = this.configuration.getAttribute("application_typeface");
        this.initAttributes();
        this.updateView();
        this.show();
    }

    mouseclickCallback(cell_index) {
        this._emit_event("dateselection_signal", this._dates[cell_index]);
    }

    mouseoverCallback(cell_index) {
        var date = this._dates[cell_index];

        if (date != null) {
            var highlight_background = this.getConfigAttribute("highlight_background");
            var cell_element = this._cells[cell_index];
            cell_element.style.border = "1px solid " + highlight_background;
            this._emit_event("datehovered_signal", date);
        }
    }

    mouseoutCallback(cell_index) {
        var date = this._dates[cell_index];
        var cell_element = this._cells[cell_index];

        if (date != null) {
            this._emit_event("dateexited_signal", date);
        }

        cell_element.style.border = "none";
    }
}

customElements.define(uiCalendar.tagname.toLowerCase(), uiCalendar);
