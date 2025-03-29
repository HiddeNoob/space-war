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
    constructor(x1,y1,x2,y2,thickness = 2,color = "#FFFFFF"){
        this.startPoint = new Point(x1,y1);
        this.endPoint = new Point(x2,y2);
        this.lineWidth = thickness;
        this.lineColor = color;
    }
}