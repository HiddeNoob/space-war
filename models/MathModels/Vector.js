class Vector{

    /** @type {number[]} */
    data;
    /** @type {Date} */
    constructTime;

    /** @type {Object} */
    belongsTo;

    /**
     * @param {number[]} array 
     */
    constructor(array){
        this.data = [...array]
    }

    /**
     * @param {Vector} vector 
     */
    add(vector){
        this.#checkIsLengthEqual(vector);
        this.data.forEach((value,index) => {
            this.data[index] += vector.data[index]; 
        })
        return this;
    }

    
    /**
     * @param {Vector} vector 
     */
    multiply(vector){
        this.#checkIsLengthEqual(vector);
        this.data.forEach((value,index) => {
            this.data[index] *= vector.data[index]; 
        })
        return this;
    }
    
    /**
     * @param {Vector} vector 
     */
    #checkIsLengthEqual(vector){
        if(this.data.length != vector.data.length) throw Error("Vector size is not equal");
    }

}

