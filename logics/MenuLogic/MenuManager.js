class MenuManager{

    /** @type {HTMLElement} */
    #rootNode
    /** @type {Menu[]} */
    #state = []

    #onLeft = []
    #onRight = []
    #onUp = []
    #onDown = []
    #onSelect = []
    #onCancel = []

    /** @param {HTMLElement} rootElement */
    constructor(rootElement){
        this.#rootNode = rootElement;

        document.addEventListener("keydown",(e) => {
            const currMenu = this.peek();
            const key = e.key;
            let isUpdated = true;
            if (key === "w"  || key === "W") {
                currMenu.decreaseIndex();
                this.#onUp.forEach((f) => f(e, currMenu.currentSelectedComponent));
            } else if (key === "s"  || key === "S") {
                currMenu.increaseIndex();
                this.#onDown.forEach((f) => f(e, currMenu.currentSelectedComponent));
            } else if (key === "a"  || key === "A") {
                this.#onLeft.forEach((f) => f(e, currMenu.currentSelectedComponent));
            } else if (key === "d"  || key === "D") {
                this.#onRight.forEach((f) => f(e, currMenu.currentSelectedComponent));
            } else if (key === " "  || key === "Enter") {
                this.#onSelect.forEach((f) => f(e, currMenu.currentSelectedComponent));
                if (currMenu.currentSelectedComponent instanceof Menu) {
                    this.push(currMenu.currentSelectedComponent); // yeni menuye gecis
                }
            } else if(key === "Backspace" || key === "Escape"){
                this.#onCancel.forEach((f) => f(e,currMenu.currentSelectedComponent));
                this.pop();
            } else{
                isUpdated = false; // rerender yapmaması için
            }
            
            isUpdated && this.drawCurrentState();
        })

    }

    /** @param {(event : KeyboardEvent,component : Component) => void} callback */
    onCancel(callback){
        this.#onCancel.push(callback);
    }

    /** @param {(event : KeyboardEvent,component : Component) => void} callback */
    onSelect(callback){
        this.#onSelect.push(callback);
    }

    /** @param {(event : KeyboardEvent,component : Component) => void} callback */
    onLeft(callback){
        this.#onLeft.push(callback);
    }
    
    /** @param {(event : KeyboardEvent,component : Component) => void} callback */
    onRight(callback){
        this.#onRight.push(callback);
    }
    
    /** @param {(event : KeyboardEvent,component : Component) => void} callback */
    onUp(callback){
        this.#onUp.push(callback);
    }
    
    /** @param {(event : KeyboardEvent,component : Component) => void} callback */
    onDown(callback){
        this.#onDown.push(callback);
    }
    
    /** @returns {Menu} */
    peek(){
        return this.#state[this.#state.length - 1];
    }

    /** @returns {Menu} */
    pop(){
        return this.#state.pop();
    }

    /** @param {Menu} menu */
    push(menu){
        this.#state.push(menu)
    }

    drawCurrentState(){
        this.#rootNode.innerHTML = "";
        this.peek().options.forEach((element) => {
            this.#rootNode.appendChild(element.HTMLComponent);
        } )
    }
}