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

        this._cells = [];
        this._today = new Date();

        var shadow = this.attachShadow({mode: 'open'});

        shadow.appendChild(this._banner = document.createElement('div'));
        shadow.appendChild(this._table = this.formatShadowElement());
    }

    //=========================================================
    //                    Object Properties
    //=========================================================
    formatShadowElement() {
        var table_element = document.createElement('table');

        for (var y=0; y < this.rowCount; ++y) {
            var row_element = document.createElement('tr');

            for (var x=0; x < this.columnCount; ++x) {
                var cell_element;

                if (y == 0) {
                    cell_element = document.createElement('th');

                    cell_element.style.backgroundColor = "green";
                    cell_element.style.color = "white";
                    cell_element.innerHTML = this.days[x];
                }
                else {
                    cell_element = document.createElement('td');

                    cell_element.style.backgroundColor = "white";
                    cell_element.style.color = "black";
                    cell_element.style.textAlign = "right";

                    this._cells.push(cell_element);
                }

                cell_element.style.width = "40px";
                cell_element.style.height = "20px";
                cell_element.style.margin = "1px";

                row_element.appendChild(cell_element);
            }

            table_element.appendChild(row_element);
        }

        table_element.style.tableLayout = "fixed";

        return table_element;
    }

    get rowCount() {
        return 7;
    }

    get columnCount() {
        return this.days.length;
    }

    get days() {
        return [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
        ];
    }

    get today() {
        return this._today;
    }

    set today(date_string) {
        this._today = new Date(date_string);
        this.updateView();
    }

    get month() {
        return new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            1,
        );
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
    updateView() {
        var today = this.today;
        var month = this.month;
        var cells = this._cells;
        var day_of_first = month.getDay();
        var previous_month = new Date(month);
        var end_of_month = new Date(month);

        previous_month.setDate(previous_month.getDate() - 1);
        end_of_month.setMonth(end_of_month.getMonth() + 1);
        end_of_month.setDate(end_of_month.getDate() - 1);

        var last_day_of_month = end_of_month.getDate();

        for (var i=0; i < cells.length; ++i) {
            var cell = cells[i];
            var day = (i - day_of_first) + 1;

            if (i < day_of_first) {
                cell.innerHTML = previous_month.getDate() - (day_of_first - (i + 1));
                cell.style.backgroundColor = "grey";
            }
            else if (day > last_day_of_month) {
                cell.innerHTML = day - last_day_of_month;
                cell.style.backgroundColor = "grey";
            }
            else {
                cell.innerHTML = (i - day_of_first) + 1;

                cell.style.backgroundColor = (
                    i == day_of_first ? "yellow" : "inherit"
                );
            }
        }

        this._banner.innerHTML = today.toLocaleDateString(
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
            this.today = this.getAttribute(name);
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
        this.setTopics();
        this.updateView();

        this.show();
    }
}

customElements.define(uiCalendar.tagname.toLowerCase(), uiCalendar);