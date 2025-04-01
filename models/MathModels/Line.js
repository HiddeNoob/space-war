class Line {
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
        this.startPoint = new Vector([x1, y1]);
        this.endPoint = new Vector([x2, y2]);
        this.lineWidth = thickness;
        this.lineColor = color;
    }

    /** @param {Line} line */
    isIntersectsWith(line) {
        const intersectPoint = Line.getIntersectPoint(this, line);

        /** @param {Vector} p1 * @param {Vector} p2 * @param {Vector} checkPoint */
        const isBetweenTheTwoPoints = (p1, p2, checkPoint) => {
            return ((p1.data[1] > checkPoint.data[1] && p2.data[1] < checkPoint.data[1]) || 
                    (p1.data[1] < checkPoint.data[1] && p2.data[1] > checkPoint.data[1]));
        };

        return isBetweenTheTwoPoints(this.startPoint, this.endPoint, intersectPoint) && 
               isBetweenTheTwoPoints(line.startPoint, line.endPoint, intersectPoint);
    }

    /** @param {Line} l1 * @param {Line} l2 */
    static getIntersectPoint(l1, l2) { // y = ax + b
        /** @param {Line} line */
        const calculateA = (line) => (line.endPoint.data[1] - line.startPoint.data[1]) / 
                                     (line.endPoint.data[0] - line.startPoint.data[0]);
        /** @param {Line} line */
        const calculateB = (line) => line.endPoint.data[1] - calculateA(line) * line.endPoint.data[0];

        const intersectX = (calculateB(l1) - calculateB(l2)) / (calculateA(l2) - calculateA(l1));
        const intersectY = calculateA(l1) * intersectX + calculateB(l1);

        return new Vector([intersectX, intersectY]);
    }

    copy() {
        return new Line(
            this.startPoint.data[0],
            this.startPoint.data[1],
            this.endPoint.data[0],
            this.endPoint.data[1],
            this.lineWidth,
            this.lineColor
        );
    }
}