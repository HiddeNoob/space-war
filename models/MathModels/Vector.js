class Vector{

    /** @type {number[]} */
    data;

    /**
     * @param {number[]} array 
     */
    constructor(array){
        this.data = [...array]
    }

    /**
     * @param {Vector | number} object 
     */
    add(object){
        if(object instanceof Vector){
            this.#checkIsLengthEqual(object);
            this.data.forEach((value,index) => {
                this.data[index] += object.data[index]; 
            })
        }else{
            this.data.forEach((value,index) => {
                this.data[index] += object;
            })
        }

        return this;
    }

    /** @param {Vector} vector */
    dot(vector) {
        this.#checkIsLengthEqual(vector);
        let result = 0;
        for (let i = 0; i < this.data.length; i++) {
            result += this.data[i] * vector.data[i];
        }
        return result;
    }

    
    /**
     * @param {Vector | number} object 
     */
    multiply(object){

        if(object instanceof Vector){
            this.#checkIsLengthEqual(object);
            this.data.forEach((value,index) => {
                this.data[index] *= object.data[index]; 
            })
        }else{
            this.data.forEach((value,index) => {
                this.data[index] *= object
            })
        }
         

        return this;
    }

    getUnitVector(){
        const hipotenus = this.toScalar()
        const newX = this.data[0] / hipotenus
        const newY = this.data[1] / hipotenus
        return new Vector([newX,newY])
    }

    toScalar(){
        return Math.sqrt(this.data[0]**2 + this.data[1]**2);
    }
    
    /**
     * @param {Vector} vector 
     */
    #checkIsLengthEqual(vector){
        if(this.data.length != vector.data.length) throw Error("Vector size is not equal");
    }

    copy(){
        return new Vector([...this.data])
    }

}

