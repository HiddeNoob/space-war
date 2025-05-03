// Menüde birden fazla seçeneği (component) yöneten ana menü sınıfı
class Menu extends Component{
    /** @type {Component[]} */
    #options = [] // Menüdeki seçenekler
    #index = 0 // Seçili olan seçeneğin indeksi

    /**
     * Menu oluşturucu
     * @param {string} menuName - Menü başlığı
     */
    constructor(menuName){
        const htmlElement = document.createElement("div")
        htmlElement.innerText = menuName;
        super(htmlElement);

    }

    /**
     * Menüye yeni bir seçenek ekler
     * @param {Component} component
     */
    addOption(component){
        this.#options.push(component);
        this.changeSelectedComponentBackground();
    }

    /**
     * Seçenekleri döndürür
     * @returns {Component[]}
     */
    get options(){
        return this.#options;
    }

    /**
     * Şu an seçili olan component'i döndürür
     * @returns {Component}
     */
    get currentSelectedComponent(){
        return this.options[this.#index];
    }

    /**
     * Seçili indeksi bir azaltır (yukarı hareket)
     */
    decreaseIndex(){
        if(this.#index < 1)
            return;
        this.#index--;
    }
    
    /**
     * Seçili indeksi bir artırır (aşağı hareket)
     */
    increaseIndex(){
        if(this.#index >= this.options.length - 1)
            return;
        this.#index++;
    }

    /**
     * Seçili component'in arka planını değiştirir
     */
    changeSelectedComponentBackground(){
        for(let component of this.#options){
            component.HTMLComponent.classList.remove("selected");
        }
        if(this.#options[this.#index]){
            this.#options[this.#index].HTMLComponent.classList.add("selected");
        }
    }
}