class Polygon {
    /** @type {Line[] | BreakableLine[]} */
    #lines;

    /**
     * @param {Line[]} lines 
     */
    constructor(lines) {
        this.#lines = lines;
        this.move(this.#getCenter().multiply(-1));
    }

    get lines() {
        return this.#lines;
    }

    #getCenter() {
        let center = new Vector(0, 0);
        for (let i = 0; i < this.#lines.length; i++) {
            center.add(this.#lines[i].startPoint);   
        }
        center.multiply(1 / this.#lines.length);
        return center;
    }
    
    /** 
     * @param {number} size 
     * @returns {Polygon}
     */
    scaleBy(size) {
        this.#lines.forEach((line) => {
            line.startPoint.multiply(size);
            line.endPoint.multiply(size);
        });
        return this;
    }

    setColor(color) {
        this.#lines.forEach((line) => line.lineColor = color);
        return this;
    }

    /**
     * @param {Vector} vector 
     */
    move(vector) {
        this.#lines.forEach((line) => line.moveLine(vector.x, vector.y));
        return this;
    }

    rotate(angle) {
        const center = this.#getCenter();
        this.#lines.forEach((line) => line.rotateLine(angle, center));
        return this;
    }

    copy() {
        return new Polygon(this.#lines.map((line) => line.copy()));
    }

    getMaxPoints() {
        const points = {
            maxX: -Infinity,
            minX: Infinity,
            maxY: -Infinity,
            minY: Infinity
        };
        this.#lines.forEach((line) => {
            const x1 = line.startPoint.x;
            const y1 = line.startPoint.y;
            const x2 = line.endPoint.x;
            const y2 = line.endPoint.y;

            points.maxX = Math.max(points.maxX, x1, x2);
            points.maxY = Math.max(points.maxY, y1, y2);
            points.minX = Math.min(points.minX, x1, x2);
            points.minY = Math.min(points.minY, y1, y2);
        });
        return points;
    }
    

    /**
     * @returns {Vector[]}
    */
    getNormals() {
        return this.#lines.map(line => line.normalVector(this.#getCenter()));
    }
}