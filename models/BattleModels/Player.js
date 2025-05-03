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
        drawAttributes = new DrawAttributes(PlayerShapes.DEFAULT_PLAYER),
        motionAttributes = new MotionAttributes(1, 1.4, 500, 1000)
    ) {
        super(drawAttributes, motionAttributes);
        this.money = money;
        this.level = level;
        this.xp = xp;
    }
}
