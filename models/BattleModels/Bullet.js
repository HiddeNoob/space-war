class Bullet extends Entity{
    /**
     * @param {DrawAttributes} drawOptions
     */
    constructor(durability,drawOptions = new DrawAttributes(BulletShapes.DEFAULT_BULLET),motionAttributes = new MotionAttributes(10,30)){
        super(drawOptions,motionAttributes);
    }

    copy(){
        return new Bullet(this.drawAttributes.copy());
    }

}