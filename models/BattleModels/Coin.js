class Coin extends Entity{
    value = 1;

    /**
     * 
     * @param {DrawAttributes} drawAttributes 
     * @param {MotionAttributes} motionAttributes 
     */
    constructor(drawAttributes,motionAttributes){
        super(drawAttributes,motionAttributes);
        this.motionAttributes.velocitySlowdownRate = 0.99
        this.canCollide = false;
    }
}