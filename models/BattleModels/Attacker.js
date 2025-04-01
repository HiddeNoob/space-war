class Attacker extends Entity{
    /** @type {Weapon} */
    weapon;

    /**
     * @param {DrawAttributes} drawAttributes
     * @param {MotionAttributes} motionAttributes
     */
    constructor(drawAttributes = new DrawAttributes(PlayerShapes.DEFAULT_PLAYER),motionAttributes = new MotionAttributes(1,10000),weapon = new Weapon()){
        super(drawAttributes,motionAttributes);
        this.weapon = weapon;
    }
    

}