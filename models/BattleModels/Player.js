class Player extends Attacker{
    /** @type {number} */
    money;
    /** @type {number} */
    level;
    /** @type {number} */
    xp;
    /** @type {number} */
    thrustPower;

    /**
     * @param {number} money 
     * @param {number} level 
     * @param {number} xp 
     * @param {number} thrustPower 
     */
    constructor(money = 0,level = 1,xp = 0,thrustPower = 8,drawAttributes = new DrawAttributes(PlayerShapes.DEFAULT_PLAYER.scaleBy(0.4))){
        super(drawAttributes);
        this.money = money;
        this.level = level;
        this.xp = xp
        this.thrustPower = thrustPower;
    }
}