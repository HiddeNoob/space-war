// Oyuncu karakterini temsil eden ana sınıf
class Player extends Attacker {
    /** @type {number} */
    money; // Oyuncunun parası
    /** @type {number} */
    level; // Oyuncunun seviyesi
    /** @type {number} */
    xp; // Oyuncunun deneyim puanı

    /**
     * Player nesnesi oluşturur
     * @param {number} money - Başlangıç parası
     * @param {number} level - Başlangıç seviyesi
     * @param {number} xp - Başlangıç deneyim puanı
     * @param {DrawAttributes} drawAttributes - Çizim özellikleri
     * @param {MotionAttributes} motionAttributes - Fiziksel özellikler
     */
    constructor(
        money = 0,
        level = 1,
        xp = 0,
        weapon = ReadyToUseObjects.weapons.PISTOL.copy(),
        drawAttributes = new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.TRIANGLE)),
        motionAttributes = new MotionAttributes(1, 1.4)
    ) {
        super(weapon,drawAttributes, motionAttributes);
        this.money = money;
        this.level = level;
        this.xp = xp;
    }

    
    copy(){
        const player = new Player(this.money,this.level,this.xp,this.weapon.copy(),this.drawAttributes.copy(),this.motionAttributes.copy());
        player.isAlive = this.isAlive;
        player.canCollide = this.canCollide;
        return player;
    }
}
