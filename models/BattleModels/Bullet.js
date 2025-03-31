class Bullet extends Entity{
    /**
     * @param {number} durability 
     * @param {DrawAttributes} drawOptions
     */
    constructor(durability,drawOptions = new DrawAttributes(BulletShapes.DEFAULT_BULLET),motionAttributes = new MotionAttributes(10,30)){
        super(durability,drawOptions,motionAttributes);
    }

    copy(){
        return new Bullet(this.health,this.drawAttributes.copy());
    }

}