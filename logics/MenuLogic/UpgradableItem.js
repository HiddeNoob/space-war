// Menüde yükseltilebilir (upgrade) bir öğeyi temsil eden bileşen sınıfı
class UpgradableItem extends Component {
    /** @type {string} */
    name; // Öğenin adı

    /** @type {number} */
    #cost; // Mevcut yükseltme maliyeti

    /** @type {number} */
    #costMultiplier; // Her upgrade sonrası maliyet çarpanı

    /** @type {number} */
    #currentLevel = 0; // Şu anki seviye

    /** @type {function} */
    onUpgrade; // Upgrade callback fonksiyonu

    /**
     * UpgradableItem oluşturucu
     * @param {string} name - Öğenin adı
     * @param {number} initialCost - Başlangıç maliyeti
     * @param {number} costMultiplier - Her upgrade sonrası maliyet çarpanı
     * @param {function} onUpgrade - Upgrade callback fonksiyonu
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

    /**
     * Öğeyi bir seviye yükseltir ve maliyeti günceller
     */
    #upgradeItem() {
        this.#currentLevel++;
        this.#cost = Math.ceil(this.#cost * this.#costMultiplier);
        this.#updateDisplay();
    }

    /**
     * Görsel güncellemeleri yapar (isim, seviye, maliyet)
     */
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

    /**
     * Şu anki seviyeyi döndürür
     */
    get currentLevel() {
        return this.#currentLevel;
    }

    /**
     * Mevcut yükseltme maliyetini döndürür
     */
    get cost() {
        return this.#cost;
    }
}