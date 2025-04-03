class MotionAttributes {
    /** @type {Vector} */
    speed = new Vector(0, 0);

    /** @type {Vector} */
    acceleration = new Vector(0, 0);

    /** @type {Vector} */
    force = new Vector(0, 0);

    /** @type {number} */
    mass;
    
    /** @type {number} */
    maxSpeed;

    /** @type {number} */
    angularVelocity = 0;

    /** @type {number} */
    angularAcceleration = 0;

    /** @type {number} */
    momentOfInertia = 10;

    /**
     * @param {number} mass 
     * @param {number} maxSpeed 
     */
    constructor(maxSpeed = 1, mass = 1000) {
        this.mass = mass;
        this.maxSpeed = maxSpeed;
    }

    resetInstantVectors() {
        this.acceleration.multiply(0);
        this.force.multiply(0);
        this.angularAcceleration = 0;
    }
}