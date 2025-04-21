class ValueHolder extends Component {

    title = "";
    #min = 0;
    #max = 100;
    #value = 50;


    /**
     * 
     * @param {string} title 
     * @param {(newValue : number) => void} onUpdate 
     * @param {number} min 
     * @param {number} max 
     */
    constructor(title, onUpdate, min, max) {
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
        this.#value = Math.floor( (min + max) / 2);

        this.actions.onRight = () => {
            this.increaseValue();
            this.actions.onUpdate()
        };

        this.actions.onLeft = () => {
            this.decreaseValue();
            
            this.actions.onUpdate()
        };

        this.#updateDisplay();


    }

    get value(){
        return this.#value;
    }

    increaseValue(){
        if(this.value < this.#max){
            this.#value++;
        }
    }

    decreaseValue(){
        if (this.value > this.#min) {
            this.#value--;
        }
    }

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