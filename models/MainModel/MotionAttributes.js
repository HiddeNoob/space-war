class MotionAttributes {
    /** @type {Vector} */
    velocity = new Vector(0, 0);

    /** @type {Vector} */
    acceleration = new Vector(0, 0);

    /** @type {Vector} */
    force = new Vector(0, 0);

    /** @type {number} */
    mass;
    
    /** @type {number} */
    maxVelocity;
    
    /** @type {number} */
    velocitySlowdownRate = 1;

    /** @type {number} */
    angularSlowdownRate = 1;

    /** @type {number} */
    maxAngularVelocity;

    /** @type {number} */
    angularVelocity = 0;

    /** @type {number} */
    angularAcceleration = 0;

    /** @type {number} */
    momentOfInertia;

    /**
     * @param {number} mass 
     * @param {number} maxVelocity 
     */
    constructor(maxAngularVelocity = 10,maxVelocity = 10, mass = 1e5,momentOfInertia = 1e8) {
        this.mass = mass;
        this.maxAngularVelocity = maxAngularVelocity;
        this.momentOfInertia = momentOfInertia;
        this.maxVelocity = maxVelocity;
    }

    resetInstantVectors() {
        this.acceleration.multiply(0);
        this.force.multiply(0);
        this.angularAcceleration = 0;
    }

    copy(){
        return new MotionAttributes(this.maxAngularVelocity,this.maxVelocity,this.mass,this.momentOfInertia)
    }
}