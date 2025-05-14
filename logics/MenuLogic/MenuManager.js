// Menülerin yönetimini ve kullanıcı etkileşimini sağlayan ana sınıf
class MenuManager {

    /** @type {HTMLElement} */
    #rootNode; // Menülerin çizileceği ana HTML node

    /** @type {Menu[]} */
    #state = []; // Menü yığını (stack)

    #handler; // Klavye event handler'ı

    /**
     * MenuManager oluşturucu
     * @param {HTMLElement} rootElement - Menülerin çizileceği ana HTML node
     */
    constructor(rootElement) {
        this.#rootNode = rootElement;
        
        // Klavye event handler'ı tanımlanır
        this.#handler = (e) => {
            const currMenu = this.peek();
            const selectedComponent = currMenu.currentSelectedComponent;
            const key = e.key.toLowerCase();
            let isUpdated = true;
            switch (key) {
                case "arrowup":
                case "w":
                    currMenu.decreaseIndex();
                    selectedComponent?.actions.onUp?.();
                    break;
                case "arrowdown":
                case "s":
                    currMenu.increaseIndex();
                    selectedComponent?.actions.onDown?.();
                    break;
                case "arrowleft":
                case "a":
                    selectedComponent?.actions.onLeft?.();
                    break;
                case "arrowright":   
                case "d":
                    selectedComponent?.actions.onRight?.();
                    break
                case " ":
                case "enter":
                    selectedComponent?.actions.onSelect?.();
                    SFXPlayer.sfxs["menu-select"].play();
                    if (selectedComponent instanceof Menu) {
                        this.push(selectedComponent);
                    }
                    break;
                case "backspace":
                case "escape":
                    if (this.#state.length > 1) {
                        SFXPlayer.sfxs["menu-discard"].play();
                        this.pop();
                    }
                    selectedComponent?.actions.onReturn?.();
                    break;
                default:
                    isUpdated = false;
            }
            currMenu.changeSelectedComponentBackground();
            isUpdated && this.updateOnChange();
        };
        document.addEventListener("keydown", this.#handler);
    }

    /**
     * Menü yığınının en üstündeki menüyü döndürür
     * @returns {Menu}
     */
    peek() {
        return this.#state[this.#state.length - 1];
    }

    /**
     * Menü yığınının en üstündeki menüyü çıkarır ve ekrandan kaldırır
     * @returns {Menu}
     */
    pop() {
        const lastState = this.#state.pop();
        this.#drawCurrentState();
        return lastState
    }

    /**
     * Menü yığınına yeni bir menü ekler ve ekranda gösterir
     * @param {Menu} menu
     */
    push(menu) {
        this.#state.push(menu);
        this.#drawCurrentState();
    }

    /**
     * Şu anki menüyü ekrana çizer
     */
    #drawCurrentState() {
        this.#rootNode.innerHTML = "";
        this.peek().options.forEach((element) => {
            this.#rootNode.appendChild(element.HTMLComponent);
        });
    }

    /**
     * Seçili component değiştiğinde arka planı günceller
     */
    updateOnChange(){
        this.peek().options.forEach((element) => {
            this.#rootNode.classList.remove("selected");
        });
        this.peek().currentSelectedComponent.HTMLComponent.classList.add("selected");
    }

    /**
     * Menü yöneticisini ve eventleri temizler
     */
    terminate() {
        document.removeEventListener("keydown", this.#handler);
        this.#rootNode.innerHTML = "";
        this.#rootNode.parentElement.removeChild(this.#rootNode);
    }
}