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
     * @param {number} thrustPower 
     * @param {number} rotatePower
     */
    constructor(money = 0, level = 1, xp = 0, thrustPower = 30,rotatePower = 1, drawAttributes = new DrawAttributes(PlayerShapes.DEFAULT_PLAYER.scaleBy(0.4))) {
        super(drawAttributes);
        this.money = money;
        this.level = level;
        this.rotatePower = rotatePower;
        this.xp = xp;
        this.thrustPower = thrustPower;
    }


}
