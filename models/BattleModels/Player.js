class Player extends Attacker{
    /** @type {number} */
    money;
    /** @type {number} */
    level;
    /** @type {number} */
    xp;
    /** @type {MotionAttributes} */
    motion;
    /** @type {number} */
    thrustPower;

    /**
     * @param {number} money 
     * @param {number} level 
     * @param {number} xp 
     * @param {number} thrustPower 
     */
    constructor(money = 0,level = 1,xp = 0,thrustPower = 0.1){
        super(100)
        this.money = money;
        this.level = level;
        this.xp = xp
        this.thrustPower = thrustPower;
        this.motion = new MotionAttributes();
    }
}