class DrawAttributes{
    location;


    shell; 
    angle;

    /**
     * @param {Point} location
     * @param {Polygon} polygon
     * @param {number} angle 
     * @param {string} color 
     */
    constructor(polygon,location = new Point(50,50), angle = 0, color  = "#ffffff"){
        this.location = location;
        this.shell = new EntityShell(polygon);
        this.angle = angle;
        this.color = color;
    }
    
    copy(){
        return new DrawAttributes(new Polygon(this.shell.breakableLines),this.location.copy(),this.angle,this.color)
    }



}
