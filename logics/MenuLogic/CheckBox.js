class CheckBox extends Component{
    #value = false;

    constructor(onSelect){
        const input = document.createElement("input");
        input.type = "checkbox"
        input.disabled = true;
        super(input);

        this.actions.onSelect = () => {
            this.changeState();
            onSelect(this.#value);
        }
    }

    changeState(){
        this.#value = !this.#value;
    }
}

