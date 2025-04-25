class Component{
    #HTMLComponent;
    actions = {
        "onRight" : null,
        "onLeft" : null,
        "onUp" : null,
        "onDown" : null,
        "onSelect" : null,
        "onReturn" : null,
        "onUpdate" : null
    }
    /**
     * 
     * @param {HTMLElement} HTMLComponent 
     */ 
    constructor(HTMLComponent){
        this.#HTMLComponent = HTMLComponent;
    }

    static create(innerText, onSelect){
        const element = document.createElement("div");
        element.innerText = innerText;
        const comp = new Component(element)
        comp.actions.onSelect = onSelect;
        return comp;
    }

    get HTMLComponent(){
        return this.#HTMLComponent;
    }
}