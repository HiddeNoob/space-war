class MenuManager {
    /** @type {Player} */
    #player;

    /** @type {HTMLElement} */
    #rootNode;

    /** @type {Menu[]} */
    #state = [];

    #handler;

    /**
     * @param {HTMLElement} rootElement
     * @param {Player} player
     */
    constructor(rootElement, player) {
        this.#player = player;
        this.#rootNode = rootElement;

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
                    if (selectedComponent instanceof Menu) {
                        this.push(selectedComponent);
                    } else if (selectedComponent instanceof ItemComponent || selectedComponent instanceof UpgradableItem) {
                        this.#attemptPurchase(selectedComponent);
                    }
                    break;
                case "backspace":
                case "escape":
                    if (this.#state.length > 1) {
                        this.pop();
                    }
                    selectedComponent?.actions.onReturn?.();
                    break;
                default:
                    isUpdated = false;
            }

            isUpdated && this.updateOnChange();
        };

        document.addEventListener("keydown", this.#handler);
    }

    /** @returns {Menu} */
    peek() {
        return this.#state[this.#state.length - 1];
    }

    /** @returns {Menu} */
    pop() {
        const lastState = this.#state.pop();
        this.#drawCurrentState();
        return lastState
    }

    /** @param {Menu} menu */
    push(menu) {
        this.#state.push(menu);
        this.#drawCurrentState();
    }

    #drawCurrentState() {
        this.#rootNode.innerHTML = "";
        this.peek().options.forEach((element) => {
            this.#rootNode.appendChild(element.HTMLComponent);
        });
    }

    updateOnChange(){
        this.peek().options.forEach((element) => {
            this.#rootNode.classList.remove("selected");
        });
        this.peek().currentSelectedComponent.HTMLComponent.classList.add("selected");
    }

    /**
     * @param {ItemComponent | UpgradableItem} component
     */
    #attemptPurchase(component) {
        const cost = component.cost;

        if (cost <= this.#player.money) {
            this.#player.money -= cost;
            component.actions.onSelect?.();
        }
    }

    terminate() {
        document.removeEventListener("keydown", this.#handler);
        this.#rootNode.innerHTML = "";
        this.#rootNode.parentElement.removeChild(this.#rootNode);
    }
}