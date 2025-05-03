// Menüde satın alınabilir bir öğeyi temsil eden bileşen sınıfı
class ItemComponent extends Component {
    /** @type {string} */
    name; // Öğenin adı

    /** @type {number} */
    cost; // Öğenin maliyeti

    /** @type {boolean} */
    isBuyed = false; // Satın alındı mı?

    /**
     * ItemComponent oluşturucu
     * @param {string} name - Öğenin adı
     * @param {number} cost - Öğenin maliyeti
     * @param {any} item - İlgili item nesnesi
     * @param {function} onBuy - Satın alındığında çağrılacak fonksiyon
     */
    constructor(name, cost, item, onBuy) {
        const element = document.createElement("div");
        super(element);
        this.item = item;
        this.name = name;
        this.cost = cost;
        // Satın alma işlemi
        this.actions.onSelect = () => {
            if (!this.isBuyed) {
                this.isBuyed = true;
                onBuy();
                this.#updateDisplay();
            }
        };
        this.#updateDisplay();
    }

    /**
     * Görsel güncellemeleri yapar (isim ve fiyat/purchased)
     */
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