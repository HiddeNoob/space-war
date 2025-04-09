class Polygon {
    /** @type {Line[]} */
    lines
   
    /**
     * @param {Line[]} lines 
     */
    constructor(lines) {
        this.lines = lines;
        this.#moveCenterToZeroPoint(this.#getCenter(lines));
    }

    /** @param {Line[]} lines */
    #getCenter(lines) {
        let center = new Vector(0, 0);
        for (let i = 0; i < lines.length; i++) {
            center.add(lines[i].startPoint);   
            center.add(lines[i].endPoint);   
        }
        center.multiply(1 / (2 * lines.length));
        return center;
    }
    
    /** @param {Vector} center */
    #moveCenterToZeroPoint(center) {
        const transform = center.copy().multiply(-1);
        this.lines.forEach((line) => {
            line.startPoint.add(transform);
            line.endPoint.add(transform);
        });
    }

    /** @param {number} size */
    scaleBy(size) {
        this.lines.forEach((line) => {
            line.startPoint.multiply(size);
            line.endPoint.multiply(size);
        });
        return this;
    }

    setColor(color){
        this.lines.forEach((line) => line.lineColor = color);
        return this;
    }

    /**
     * @param {Vector} vector 
     */
    move(vector){
        this.lines.forEach((line) => line.moveLine(vector.x,vector.y));
        return this;
    }
    rotate(angle){
        this.lines.forEach((line) => line.rotateLine(angle));
        return this;
    }

    copy(){
        return new Polygon(this.lines.map((line) => line.copy()));
    }
}