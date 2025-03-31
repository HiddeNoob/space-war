class Attacker extends Entity{
    /** @type {Weapon} */
    weapon;

    /**
     * @param {number} health
     * @param {DrawAttributes} drawAttributes
     * @param {MotionAttributes} motionAttributes
     */
    constructor(health = 100,drawAttributes = new DrawAttributes(PlayerShapes.DEFAULT_PLAYER),motionAttributes = new MotionAttributes(1,10000),weapon = new Weapon()){
        super(health,drawAttributes,motionAttributes);
        this.weapon = weapon;
    }
    

}