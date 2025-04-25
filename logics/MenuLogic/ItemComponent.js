class ItemComponent extends Component {

    /** @type {string} */
    name;

    /** @type {number} */
    cost;

    /** @type {boolean} */
    isBuyed = false;

    /**
     * @param {string} name
     * @param {number} cost
     * @param {function} onBuy
     */
    constructor(name, cost,item, onBuy) {
        const element = document.createElement("div");
        super(element);

        this.item = item;
        this.name = name;
        this.cost = cost;

        this.actions.onSelect = () => {
            if (!this.isBuyed) {
                this.isBuyed = true;
                onBuy();
                this.#updateDisplay();
            }
        };

        this.#updateDisplay();
    }

    #updateDisplay() {
        const item = this.HTMLComponent;
        item.innerHTML = "";

        const nameElement = document.createElement("p");
        nameElement.innerText = this.name;

        const costElement = document.createElement("p");
        costElement.innerText = this.isBuyed ? "Purchased" : `${this.cost} ₺`;

        item.appendChild(nameElement);
        item.appendChild(costElement);
    }
}