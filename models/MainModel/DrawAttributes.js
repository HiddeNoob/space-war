class DrawAttributes{
    location;
    polygon; 
    angle;

    /**
     * @param {Point} location
     * @param {Polygon} polygon
     * @param {number} angle 
     * @param {string} color 
     */
    constructor(polygon,location = new Point(0,0), angle = 0, color  = "#ffffff"){
        this.location = location;
        this.polygon = polygon;
        this.angle = angle;
        this.color = color;
    }




}
