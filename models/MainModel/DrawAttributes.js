class DrawAttributes {

    static calculatedTimestamp = 0; 
    static calculatedShells = new Map();

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
            new Polygon(this.shell.lines),
            this.location.copy(),
            this.angle,
            this.color
        );
    }

    getActualShell(){
        if(globalGameVariables.latestPaintTimestamp != DrawAttributes.calculatedTimestamp)
            DrawAttributes.calculatedShells = new Map();
        if(DrawAttributes.calculatedShells.has(this))
            return DrawAttributes.calculatedShells.get(this);
        else{
            const calculated = this.shell.copy().rotate(this.angle).move(this.location)
            DrawAttributes.calculatedShells.set(this,calculated);
            return calculated;
        }
    }
}
