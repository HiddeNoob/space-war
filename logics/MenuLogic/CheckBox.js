// Menüde kullanılabilen bir onay kutusu (checkbox) bileşeni
class CheckBox extends Component{
    #value = false; // Onay kutusunun mevcut değeri (işaretli mi?)

    /**
     * CheckBox oluşturucu
     * @param {boolean} initalValue - Başlangıç değeri (işaretli mi?)
     * @param {(value : boolean) => void} onSelect - Seçim değiştiğinde çağrılacak fonksiyon
     */
    constructor(title,initalValue,onSelect){
        const div = document.createElement("div");
        div.classList.add("CheckBox");
        super(div);
        this.title = title;
        this.#value = initalValue;

        // Seçim değiştiğinde state güncellenir ve callback çalışır
        this.actions.onSelect = () => {
            this.changeState();
            onSelect(this.#value);
            this.actions.onUpdate();
        }

        this.actions.onUpdate = () => {
            this.#updateDisplay();
        }
        this.#updateDisplay();
    }

    /**
     * Onay kutusunun durumunu değiştirir (işaretli/değil)
     */
    changeState(){
        this.#value = !this.#value;
    }

        /**
     * Görsel güncellemeleri yapar (başlık, değer, slider)
     */
    #updateDisplay(){
        this.HTMLComponent.innerHTML = "";
        const wrapper = document.createElement("div");
        wrapper.classList.add("CheckBoxComponent");

        const title = document.createElement("span");
        title.innerText = this.title;
        wrapper.appendChild(title);

        const input = document.createElement("input");
        input.type = "checkbox";
        input.disabled = true;
        input.checked = this.#value;

        wrapper.appendChild(input);

        this.HTMLComponent.appendChild(wrapper);
    }
}

