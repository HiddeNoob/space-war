class MotionAttributes{
    /** @type {Vector} */
    speed;
    /** @type {Vector} */
    acceleration;
    /** @type {number} */
    mass;

    /**
     * @param {Vector} speed 
     * @param {Vector} acceleration 
     * @param {number} mass 
     */
    constructor(speed = new Vector([0,0,0]),acceleration = new Vector([0,0,0]),mass = 10){
        this.speed = speed;
        this.acceleration = acceleration;
        this.mass = mass;
    }
}