class Component{
    #HTMLComponent;
    /**
     * 
     * @param {HTMLElement} HTMLComponent 
     */ 
    constructor(HTMLComponent){
        this.#HTMLComponent = HTMLComponent;
    }

    static create(innerText){
        const element = document.createElement("div");
        element.innerText = innerText;
        return new Component(element);
    }

    get HTMLComponent(){
        return this.#HTMLComponent;
    }
}