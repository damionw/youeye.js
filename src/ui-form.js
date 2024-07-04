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
        this._fields = {};
    }

    //=========================================================
    //                         Events
    //=========================================================
    elementsChanged(newElements) {
        var lookup = this._fields;

        function get_children(element) {
            var results = [];

            for (const child_element of element.children || []) {
                if (child_element.getAttribute == null) {
                    continue;
                }

                if (child_element.children == null) {
                    continue;
                }

                if (child_element.tagName == null) {
                    continue;
                }

                if (child_element.tagName == "UI-FORM") {
                    continue;
                }

                results.push(child_element);

                for (const inner_element of get_children(child_element)) {
                    results.push(inner_element);
                }
            }

            return results;
        }

        for (const form_element of get_children(this)) {
            if (form_element.getAttribute == null) {
                continue;
            }

            const element_name = form_element.getAttribute("form-name");

            if (element_name == null) {
                continue;
            }

            const element_getter = new String(
                form_element.getAttribute("form-attribute") || "innerText"
            );

            this._fields[element_name] = {
                get_name() {
                    return element_name;
                },

                get_value() {
                    return form_element[element_getter];
                }
            };
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
    get value() {
        const self = this;

        if (self._fields == null) {
            return {};
        }

        return Object.fromEntries(
            Object.keys(self._fields).map(
                function(_key) {
                    return [
                        _key, {
                            "name": self._fields[_key].get_name(),
                            "value": self._fields[_key].get_value()
                        }
                    ];
                }
            )
        );
    }
}

customElements.define(
    uiForm.tagname.toLowerCase(),
    uiForm
);
