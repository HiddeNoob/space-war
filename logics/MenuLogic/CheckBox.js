// Menüde kullanılabilen bir onay kutusu (checkbox) bileşeni
class CheckBox extends Component{
    #value = false; // Onay kutusunun mevcut değeri (işaretli mi?)

    /**
     * CheckBox oluşturucu
     * @param {(value : boolean) => void} onSelect - Seçim değiştiğinde çağrılacak fonksiyon
     */
    constructor(onSelect){
        const input = document.createElement("input");
        input.type = "checkbox"
        input.disabled = true;
        super(input);
        // Seçim değiştiğinde state güncellenir ve callback çalışır
        this.actions.onSelect = () => {
            this.changeState();
            onSelect(this.#value);
        }
    }

    /**
     * Onay kutusunun durumunu değiştirir (işaretli/değil)
     */
    changeState(){
        this.#value = !this.#value;
    }
}

