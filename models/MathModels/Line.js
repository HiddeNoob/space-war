class Line{
    /** @type {Point} */
    startPoint;
    /** @type {Point} */
    endPoint;
    
    /** @type {number} */
    lineWidth;
    
    /** @type {string} */
    lineColor

    /**
     * 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} x1 
     * @param {number} y2 
     * @param {number} thickness 
     * @param {string} color 
     */
    constructor(x1,y1,x2,y2,thickness = 1,color = "#FFFFFF"){
        this.startPoint = new Point(x1,y1);
        this.endPoint = new Point(x2,y2);
        this.lineWidth = thickness;
        this.lineColor = color;
    }

    /** @param {Line} line */
    isIntersectsWith(line){
        const intersectPoint = Line.getIntersectPoint(this,line);

        /** @param {Point} p1 * @param {Point} p2 * @param {Point} checkPoint */
        const isBetweenTheTwoPoints = (p1,p2,checkPoint) => {
            return ((p1.y > checkPoint.y && p2.y < checkPoint.y) || (p1.y < checkPoint.y && p2.y > checkPoint.y))
        }

        return isBetweenTheTwoPoints(this.startPoint,this.endPoint,intersectPoint) && isBetweenTheTwoPoints(line.startPoint,line.endPoint,intersectPoint);
    }

    /** @param {Line} l1 * @param {Line} l2 */
    static getIntersectPoint(l1,l2){ // y = ax + b

        /** @param {Line} line */
        const calculateA = (line) => (line.endPoint.y - line.startPoint.y) / (line.endPoint.x - line.startPoint.x);
        /** @param {Line} line */
        const calculateB = (line) => (line.endPoint.y - calculateB(line) - line.endPoint.x)

        const intersectX = (calculateB(l1) - calculateB(l2)) / (calculateA(l2) - calculateA(l1))
        const intersectY = calculateA(l1) * intersectX + calculateB(l1);

        return new Point(intersectX,intersectY);
    }


}