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
    accelerationPower;

    /**
     * @param {number} money 
     * @param {number} level 
     * @param {number} xp 
     * @param {number} accelaration 
     */
    constructor(money = 0,level = 1,xp = 0,accelaration = 1){
        super(100)
        this.money = money;
        this.level = level;
        this.xp = xp
        this.accelaration = accelaration;
        this.motion = new MotionAttributes();
    }
}