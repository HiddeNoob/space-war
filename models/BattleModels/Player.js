class Player extends Attacker {
    /** @type {number} */
    money;
    /** @type {number} */
    level;
    /** @type {number} */
    xp;
    /** @type {number} */
    thrustPower;
    /** @type {number} */
    rotatePower;



    /**
     * @param {number} money 
     * @param {number} level 
     * @param {number} xp 
     */
    constructor(money = 0, level = 1, xp = 0,drawAttributes = new DrawAttributes(PlayerShapes.DEFAULT_PLAYER), motionAttributes = new MotionAttributes(1,10,500,1000)) {
        super(drawAttributes,motionAttributes);
        this.money = money;
        this.level = level;
        this.rotatePower = motionAttributes.momentOfInertia * 1e-2;
        this.thrustPower = motionAttributes.mass * 1e-2;
        this.xp = xp;
    }


}
