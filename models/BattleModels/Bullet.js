class Bullet extends Entity{
    /** @type {number} */
    damage = 0;

    /**
     * @param {DrawAttributes} drawOptions
     */
    constructor(damage = 5,drawOptions = new DrawAttributes(BulletShapes.DEFAULT_BULLET),motionAttributes = new MotionAttributes(10,1)){
        super(drawOptions,motionAttributes);
        this.drawAttributes.shell.setDurability(1);
        this.damage = damage;
    }


    copy(){
        return new Bullet(this.damage,this.drawAttributes.copy());
    }

}