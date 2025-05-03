// Menüde kullanılabilen temel bileşen (component) sınıfı
class Component{
    #HTMLComponent; // Bileşenin HTML elementi
    actions = {
        "onRight" : null, // Sağ tuş aksiyonu
        "onLeft" : null, // Sol tuş aksiyonu
        "onUp" : null, // Yukarı tuş aksiyonu
        "onDown" : null, // Aşağı tuş aksiyonu
        "onSelect" : null, // Seçim aksiyonu
        "onReturn" : null, // Geri dönüş aksiyonu
        "onUpdate" : null // Değişiklik olduğunda aksiyon
    }
    /**
     * Component oluşturucu
     * @param {HTMLElement} HTMLComponent - Temel HTML elementi
     */ 
    constructor(HTMLComponent){
        this.#HTMLComponent = HTMLComponent;
    }

    /**
     * Kolayca bir component oluşturur
     * @param {string} innerText - Bileşen metni
     * @param {function} onSelect - Seçim callback'i
     * @returns {Component}
     */
    static create(innerText, onSelect){
        const element = document.createElement("div");
        element.innerText = innerText;
        const comp = new Component(element)
        comp.actions.onSelect = onSelect;
        return comp;
    }

    /**
     * Bileşenin HTML elementini döndürür
     */
    get HTMLComponent(){
        return this.#HTMLComponent;
    }
}