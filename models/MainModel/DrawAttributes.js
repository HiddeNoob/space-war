class DrawAttributes {
    location;

    shell; 
    angle;

    /**
     * @param {Vector} location
     * @param {Polygon} polygon
     * @param {number} angle 
     * @param {string} color 
     */
    constructor(polygon, location = new Vector(50, 50), angle = 0, color = "#ffffff") {
        this.location = location;
        this.shell = new EntityShell(polygon);
        this.angle = angle;
        this.color = color;
    }
    
    copy() {
        return new DrawAttributes(
            new Polygon(this.shell.breakableLines),
            this.location.copy(),
            this.angle,
            this.color
        );
    }
}
