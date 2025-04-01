class Entity{
    /** @type {MotionAttributes} */
    motionAttributes
    /** @type {DrawAttributes} */
    drawAttributes
    /**
     * @param {DrawAttributes} drawAttributes
     */
    constructor(drawAttributes = new DrawAttributes(GlobalShapes.RECTANGLE),motionAttributes = new MotionAttributes()){
        this.drawAttributes = drawAttributes;
        this.motionAttributes = motionAttributes;
    }

}