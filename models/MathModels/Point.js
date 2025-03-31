class Point{


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

    copy(){
        return new Point(this.x,this.y);
    }

    /** @param {Point} point */
    set(point){
        this.x = point.x;
        this.y = point.y;
    }


    /** @param {Point | number} object */
    add(object){
        if(object instanceof Point){
            this.x += object.x;
            this.y += object.y;
            return this;
        }else{
            this.x += object;
            this.y += object;
        }
    }
    
    /** @param {Point | number} object */
    multiply(object){
        if(object instanceof Point){
            this.x *= object.x;
            this.y *= object.y;
        }
        else{
            this.x *= object;
            this.y *= object;
        }
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