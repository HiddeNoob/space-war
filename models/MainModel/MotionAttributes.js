// Bir entity'nin fiziksel hareket (kinematik) özelliklerini tutan ana sınıf
class MotionAttributes {
    /** @type {Vector} */
    velocity = new Vector(0, 0); // Hız vektörü
    /** @type {Vector} */
    acceleration = new Vector(0, 0); // İvme vektörü
    /** @type {Vector} */
    force = new Vector(0, 0); // Kuvvet vektörü
    /** @type {number} */
    mass; // Kütle
    /** @type {number} */
    maxVelocity; // Maksimum hız
    /** @type {number} */
    velocitySlowdownRate = 1; // Hız yavaşlama katsayısı
    /** @type {number} */
    angularSlowdownRate = 1; // Açısal hız yavaşlama katsayısı
    /** @type {number} */
    maxAngularVelocity; // Maksimum açısal hız
    /** @type {number} */
    angularVelocity = 0; // Açısal hız
    /** @type {number} */
    torque = 0; // Tork
    /** @type {number} */
    momentOfInertia; // Atalet momenti
    /**
     * MotionAttributes oluşturucu
     * @param {number} maxAngularVelocity - Maksimum açısal hız
     * @param {number} maxVelocity - Maksimum hız
     */
    constructor(maxAngularVelocity = 10,maxVelocity = 10) {
        this.maxAngularVelocity = maxAngularVelocity;
        this.maxVelocity = maxVelocity;
    }
    /**
     * Anlık vektörleri (ivme, kuvvet, tork) sıfırlar
     */
    resetInstantVectors() {
        this.acceleration.multiply(0);
        this.force.multiply(0);
        this.torque = 0;
    }
    /**
     * MotionAttributes'ın kopyasını oluşturur
     * @returns {MotionAttributes}
     */
    copy(){
        const motion = new MotionAttributes(this.maxAngularVelocity,this.maxVelocity);
        motion.velocity = this.velocity.copy();
        motion.acceleration = this.acceleration.copy();
        motion.force = this.force.copy();
        motion.mass = this.mass;
        motion.velocitySlowdownRate = this.velocitySlowdownRate;
        motion.angularSlowdownRate = this.angularSlowdownRate;
        motion.angularVelocity = this.angularVelocity;
        motion.torque = this.torque;
        motion.momentOfInertia = this.momentOfInertia;
        motion.maxAngularVelocity = this.maxAngularVelocity;
        motion.maxVelocity = this.maxVelocity;
        return motion;  
    }
}