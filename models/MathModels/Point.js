class Point{ // immutable
    #x;
    #y;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x,y){
        this.#x = x;
        this.#y = y;
    }

    getX(){
        return this.#x;
    }
    getY(){
        return this.#y;
    }

    /** @param {Point} point */
    add(point){
        return new Point(this.getX() + point.getX(),this.getY() + point.getY());
    }
    
    /** @param {Point} point */
    multiply(point){
        return new Point(this.getX() * point.getX(),this.getY() * point.getY());
    }
}