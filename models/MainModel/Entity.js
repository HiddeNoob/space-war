class Entity{
    /** @type {number} */
    health
    /** @type {MotionAttributes} */
    motionAttributes
    /** @type {DrawAttributes} */
    drawAttributes
    /**
     * @param {number} health 
     * @param {DrawAttributes} drawAttributes
     */
    constructor(health = 100,drawAttributes = new DrawAttributes(GlobalShapes.RECTANGLE),motionAttributes = new MotionAttributes()){
        this.drawAttributes = drawAttributes;
        this.motionAttributes = motionAttributes;
        this.health = health;
    }

}