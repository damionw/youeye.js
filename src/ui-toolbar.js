class uiToolBar extends uiFrame {
    static get tagname() {
        return "UI-TOOLBAR";
    }

    constructor() {
        super();
    }

    static get defaultAttributes() {
        return Object.assign(
            uiFrame.defaultAttributes, {
                "orientation": "column",
                "width": "100%",
                "height": "default",
                "pad": true,
            }
        );
    }

    elementsChanged(newElements) {
//         for (var i=0; i < this.childNodes.length; ++i){
//             var elem = this.childNodes[i];
// 
//             if (elem.style == null) {
//                 continue;
//             }
//         }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "height") {
            this.style.height = (
                this.getAttribute("height") == "default" ?
                this.configuration.getAttribute("toolbar_height") :
                this.getAttribute("height")
            );
        }
        else {
            uiFrame.prototype.attributeChangedCallback.call(this, name, oldValue, newValue);
        }
    }

    connectedCallback() {
        uiFrame.prototype.connectedCallback.call(this);
    }
}

customElements.define(uiToolBar.tagname.toLowerCase(), uiToolBar);