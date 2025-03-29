class Creature extends Entity{
    health

    /**
     * @param {Point} location
     * @param {Point[]} path 
     * @param {number} angle 
     * @param {string} color 
     */
    constructor(health,location, path, angle, color){
        super(location,path,angle,color);
        this.health;
    }
}