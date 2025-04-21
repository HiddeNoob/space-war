class Menu extends Component{

    /** @type {Component[]} */
    #options = []
    #index = 0

    constructor(menuName){
        const htmlElement = document.createElement("div")
        htmlElement.innerText = menuName;
        super(htmlElement);
    }

    /** @param {Component} component */
    addOption(component){
        this.#options.push(component);
    }


    get options(){
        
        this.#changeSelectedComponentBackground();
        return this.#options;
    }

    get currentSelectedComponent(){
        return this.options[this.#index];
    }

    decreaseIndex(){
        if(this.#index < 1)
            return;
        
        this.#index--;
    }
    
    increaseIndex(){
        if(this.#index >= this.options.length - 1)
            return;

        this.#index++;
    }

    #changeSelectedComponentBackground(){
        for(let component of this.#options){
            component.HTMLComponent.classList.remove("selected");
        }
        if(this.#options[this.#index]){
            this.#options[this.#index].HTMLComponent.classList.add("selected");
        }
    }
    
}