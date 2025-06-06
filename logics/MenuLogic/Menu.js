// Menüde birden fazla seçeneği (component) yöneten ana menü sınıfı
class Menu extends Component{
    /** @type {TextComponent} */
    #title
    /** @type {Component[]} */
    #options = [] // Menüdeki seçenekler
    #index = 0 // Seçili olan seçeneğin indeksi
    

    /**
     * Menu oluşturucu
     * @param {string} menuName - Menü başlığı, menü açıldığında üstte görünen isim
     */
    constructor(menuName){
        const htmlElement = document.createElement("div")
        htmlElement.innerText = menuName;
        super(htmlElement);
        this.#title = new TextComponent(menuName);
        this.#title.HTMLComponent.classList.add("menu-title");


    }

    /**
     * Menüye yeni bir seçenek ekler
     * @param {Component} component
     */
    addOption(component){
        this.#options.push(component);
        this.changeSelectedComponentBackground();
    }

    get title(){
        return this.#title;
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
        SFXPlayer.sfxs["menu-change"].play();
    }
    
    /**
     * Seçili indeksi bir artırır (aşağı hareket)
     */
    increaseIndex(){
        if(this.#index >= this.options.length - 1)
            return;
        this.#index++;
        SFXPlayer.sfxs["menu-change"].play();
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