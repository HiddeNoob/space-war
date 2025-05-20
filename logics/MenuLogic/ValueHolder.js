// Menüde bir değeri (ör: ses, parlaklık) tutan ve ayarlanabilen bileşen sınıfı
class ValueHolder extends Component {
    title = ""; // Değerin başlığı
    #min = 0; // Minimum değer
    #max = 100; // Maksimum değer
    #value = 50; // Mevcut değer

    /**
     * ValueHolder oluşturucu
     * @param {string} title - Değer başlığı
     * @param {(newValue : number) => void} onUpdate - Değer değiştiğinde çağrılacak fonksiyon
     * @param {number} min - Minimum değer
     * @param {number} max - Maksimum değer
     */
    constructor(title, onUpdate, min, max, initalValue = (min + max) / 2) {
        const item = document.createElement("div");
        item.classList.add("valueHolder");
        super(item);
        this.actions.onUpdate = () => {
            onUpdate(this.value);
            this.#updateDisplay();
        }
        this.title = title;

        this.#min = min;
        this.#max = max;

        this.actions.onRight = () => {
            this.increaseValue();
            this.actions.onUpdate()
        };
        this.actions.onLeft = () => {
            this.decreaseValue();
            this.actions.onUpdate()
        };
        this.#updateDisplay();

        this.#value = initalValue;
        this.actions.onUpdate();
    }

    /**
     * Mevcut değeri döndürür
     */
    get value(){
        return this.#value;
    }

    /**
     * Değeri bir artırır (max'ı geçmez)
     */
    increaseValue(){
        if(this.value < this.#max){
            this.#value++;
        }
    }

    /**
     * Değeri bir azaltır (min'i geçmez)
     */
    decreaseValue(){
        if (this.value > this.#min) {
            this.#value--;
        }
    }

    /**
     * Görsel güncellemeleri yapar (başlık, değer, slider)
     */
    #updateDisplay(){
        this.HTMLComponent.innerHTML = "";
        const titleElement = document.createElement("p");
        titleElement.innerText = this.title;
        this.HTMLComponent.appendChild(titleElement);
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        const valueElement = document.createElement("p");
        valueElement.innerText = `${this.#value}`;
        wrapper.appendChild(valueElement);
        const htmlRange = document.createElement("input");
        htmlRange.type = "range"
        htmlRange.disabled = true;
        htmlRange.value = this.value.toString();
        htmlRange.min = this.#min.toString();
        htmlRange.max = this.#max.toString();
        wrapper.appendChild(htmlRange);
        this.HTMLComponent.appendChild(wrapper);
    }
}