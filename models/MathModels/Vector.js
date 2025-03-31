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

}

