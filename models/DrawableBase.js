class DrawableBase{
    location = new Point(0,0);
    path = [new Point(0,0), new Point(1,1)]
    angle = 0
    color = "#ffffff"

    /**
     * @param {Point} location
     * @param {Point[]} path 
     * @param {number} angle 
     * @param {string} color 
     */
    constructor(location, path, angle, color){
        this.location = location;
        this.path = path;
        this.angle = angle;
        this.color = color;
    }
}
