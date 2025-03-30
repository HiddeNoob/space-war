class Point{ // immutable
    x;
    y;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    /** @param {Point} point */
    add(point){
        this.x += point.x;
        this.y += point.y;
        return this;
    }
    
    /** @param {Point} point */
    multiply(point){
        this.x *= point.x;
        this.y *= point.y;
        return this;
    }

    /**
     * 
     * @param {Point} p1 
     * @param {Point} p2 
     * @returns 
     */
    static add(p1,p2){
        return new Point(p1.x + p2.x,p1.y + p2.y);
    }
    static multiply(p1,p2){
        return new Point(p1.x * p2.x,p1.y * p2.y);
    }
}