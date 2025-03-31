class MotionAttributes{
    
    /** @type {Vector} */
    speed = new Vector([0,0]);

    /** @type {Vector} */
    acceleration = new Vector([0,0]);

    /** @type {Vector} */
    force = new Vector([0,0]);

    /** @type {number} */
    mass;
    
    /** @type {number} */
    maxSpeed

    /**
     * @param {number} mass 
     * @param {number} maxSpeed 
     */
    constructor(maxSpeed = 1,mass = 1000){
        this.mass = mass;
        this.maxSpeed = maxSpeed;
    }

    resetInstantVectors(){
        // this.speed.multiply(new Vector([0,0])); hız önceki kareden veri taşımalı
        this.acceleration.multiply(new Vector([0,0])); // kuvvet ise her karede değişebilir
        this.force.multiply(new Vector([0,0]));
    }
}