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

        for (var i=0; i < newElements.length; ++i) {
            var form_element = newElements[i];

            if (form_element.getAttribute == null) {
                continue;
            }

            var element_name = form_element.getAttribute("form-name");

            if (element_name == null) {
                continue;
            }

            var element_value = form_element.getAttribute("form-attribute") || "innerText";

            var definition = lookup[element_name] || {};

            console.log("Adding " + element_name); // DEBUG

            definition["get_name"] = function() {
                return element_name;
            }

            definition["get_value"] = function() {
                return form_element.getAttribute(element_value);
            }

            lookup[element_name] = definition;
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
