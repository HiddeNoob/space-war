class TextComponent extends Component {
    /**
     * @param {string} text - Görüntülenecek metin
     */
    constructor(text) {
        const element = document.createElement("div");
        element.innerText = text;
        super(element);
    }

    /**
     * Metni günceller
     * @param {string} newText
     */
    setText(newText) {
        this.HTMLComponent.innerText = newText;
    }

    /**
     * Mevcut metni döndürür
     */
    get text() {
        return this.HTMLComponent.innerText;
    }
}