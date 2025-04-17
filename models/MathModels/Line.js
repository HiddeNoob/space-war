class Line {
    static #tolerans = 1e-2;

    /** @type {Entity} */
    belongsTo

    /** @type {Vector} */
    startPoint;
    /** @type {Vector} */
    endPoint;
    
    /** @type {number} */
    lineWidth;
    
    /** @type {string} */
    lineColor;

    /**
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     * @param {number} thickness 
     * @param {string} color 
     */
    constructor(x1, y1, x2, y2, thickness = 1, color = "#FFFFFF") {
        this.startPoint = new Vector(x1, y1);
        this.endPoint = new Vector(x2, y2);
        this.lineWidth = thickness;
        this.lineColor = color;
    }

    /** @param {Line} line */
    getIntersectPoint(line) {


        const intersectPoint = Line.#getIntersectPoint(this, line);

        /** @param {Vector} p1 * @param {Vector} p2 * @param {Vector} checkPoint */
        const isBetweenTheTwoPoints = (p1, p2, checkPoint) => {
            return ((p1.y >= checkPoint.y && p2.y <= checkPoint.y) || 
                    (p1.y <= checkPoint.y && p2.y >= checkPoint.y)) && 
                    ((p1.x >= checkPoint.x && p2.x <= checkPoint.x) || 
                    (p1.x <= checkPoint.x && p2.x >= checkPoint.x));
        }

        if(isBetweenTheTwoPoints(this.startPoint, this.endPoint, intersectPoint) && 
           isBetweenTheTwoPoints(line.startPoint, line.endPoint, intersectPoint)){
            return intersectPoint
        }
        return null;
        


    }

    /** @param {Line} l1 * @param {Line} l2 */
    static #getIntersectPoint(l1, l2) { // y = ax + b

        /** @param {Line} line */
        const calculateA = (line) => line.slope();
        /** @param {Line} line */
        const calculateB = (line) => line.endPoint.y - calculateA(line) * line.endPoint.x;
        
        const slope1 = calculateA(l1);
        const slope2 = calculateA(l2);

        if(slope1 == Infinity){
            const intersectPoint = new Vector(l1.startPoint.x,l2.findY(l1.startPoint.x));
            return intersectPoint;
        }
        else if(slope2 == Infinity){
            const intersectPoint = new Vector(l2.startPoint.x,l1.findY(l2.startPoint.x));
            return intersectPoint;
        }
        

        const intersectX = (calculateB(l1) - calculateB(l2)) / (calculateA(l2) - calculateA(l1));
        const intersectY = calculateA(l1) * intersectX + calculateB(l1);
        return new Vector(intersectX, intersectY);

    }

    findY(x){ // ax + b = y
        const a = this.slope();

        if(a === Infinity){
            return null;
        }else if(a < Line.#tolerans){
            return this.startPoint.y;
        }

        const b = this.startPoint.y - this.startPoint.x * a;
        return x * a + b;
    }

    findX(y){
        const a = this.slope();
        if(a == Infinity){
            return this.startPoint.x;
        }else if(a < Line.#tolerans){
            return null;
        }

        const b = this.startPoint.y - this.startPoint.x * a;
        return (y - b)/a;
    }

    

    /** @param {number} dx * @param {number} dy */
    moveLine(dx,dy){
        this.startPoint.x += dx
        this.startPoint.y += dy
        this.endPoint.x += dx
        this.endPoint.y += dy
        return this;
    }

    angle(){
        let angle = this.startPoint.copy().subtract(this.endPoint).angle()
        return angle;
    }

    slope(){
        const angle = this.angle();
        if(angle > Math.PI / 2 - Line.#tolerans && angle < Math.PI / 2 + Line.#tolerans) // yakin acilari dik sayiyoruz
        {
            return Infinity;
        }
        return Math.tan(angle);
    }

    /**
     * @param {number} angle
     */
    rotateLine(angle, pivot = new Vector(0, 0)) {
        this.startPoint = this.startPoint.subtract(pivot).rotate(angle).add(pivot);
        this.endPoint = this.endPoint.subtract(pivot).rotate(angle).add(pivot);
        return this;
    }

    normalVector(pivot = new Vector(0, 0)) {
        const vector = this.startPoint.copy().subtract(this.endPoint).rotate(Math.PI / 2).normalize();
        const r = this.centerPoint().copy().subtract(pivot).normalize();
        if(vector.dot(r) < 0){
            vector.multiply(-1);
        }
        return vector;

    }

    normalize(){
        return new Vector(this.slope(),1).normalize();
    }

    centerPoint(){
        return this.startPoint.copy().add(this.endPoint.copy()).multiply(1/2);
    }

    copy() {
        return new Line(
            this.startPoint.x,
            this.startPoint.y,
            this.endPoint.x,
            this.endPoint.y,
            this.lineWidth,
            this.lineColor
        );
    }
}