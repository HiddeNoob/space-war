class UpgradableItem extends Component {
    /** @type {string} */
    name;

    /** @type {number} */
    #cost;

    /** @type {number} */
    #costMultiplier;

    /** @type {number} */
    #currentLevel = 0;

    /** @type {function} */
    onUpgrade;

    /**
     * @param {string} name
     * @param {number} initialCost
     * @param {number} costMultiplier
     * @param {function} onUpgrade
     */
    constructor(name, initialCost, costMultiplier, onUpgrade) {
        const element = document.createElement("div");
        element.classList.add("item");
        super(element);

        this.name = name;
        this.#cost = initialCost;
        this.#costMultiplier = costMultiplier;
        this.onUpgrade = onUpgrade;

        this.actions.onSelect = () => {
            this.#upgradeItem();
            this.onUpgrade(this.#currentLevel);

        };

        this.#updateDisplay();
    }

    #upgradeItem() {
        this.#currentLevel++;
        this.#cost = Math.ceil(this.#cost * this.#costMultiplier);
        this.#updateDisplay();
    }

    #updateDisplay() {
        const item = this.HTMLComponent;
        item.innerHTML = "";

        const nameElement = document.createElement("p");
        nameElement.innerText = this.name;

        const levelElement = document.createElement("p");
        levelElement.innerText = `Level: ${this.#currentLevel}`;

        const costElement = document.createElement("p");
        costElement.innerText = `Upgrade Cost: ${this.#cost} ₺`;

        item.appendChild(nameElement);
        item.appendChild(levelElement);
        item.appendChild(costElement);
    }

    get currentLevel() {
        return this.#currentLevel;
    }

    get cost() {
        return this.#cost;
    }
}