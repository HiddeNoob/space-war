class MotionAttributes{
    /** @type {Vector} */
    speed;
    /** @type {Vector} */
    acceleration;
    /** @type {Vector} */
    force;
    /** @type {number} */
    mass;

    /**
     * @param {Vector} speed 
     * @param {Vector} acceleration 
     * @param {Vector} force 
     * @param {number} mass 
     */
    constructor(speed = new Vector([0,0]),acceleration = new Vector([0,0]),force = new Vector([0,0]),mass = 10){
        this.speed = speed;
        this.acceleration = acceleration;
        this.force = force;
        this.mass = mass;
    }

    resetInstantVectors(){
        // this.speed.multiply(new Vector([0,0])); hız önceki kareden veri taşımalı
        this.acceleration.multiply(new Vector([0,0])); // kuvvet ise her karede değişebilir
        this.force.multiply(new Vector([0,0]));
    }
}