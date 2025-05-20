// Oyuncu karakterini temsil eden ana sınıf
class Player extends Attacker {
    /** @type {number} */
    money; // Oyuncunun parası
    /** @type {number} */
    level; // Oyuncunun seviyesi
    /** @type {number} */
    xp; // Oyuncunun deneyim puanı
    /** @type {number} */
    xpToLevelUp = 100; // Oyuncunun seviye atlaması için gereken deneyim puanı

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
        weapons = [ReadyToUseObjects.weapons.PISTOL.copy()],
        drawAttributes = new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.TRIANGLE)),
        motionAttributes = new MotionAttributes(1, 1.4)
    ) {
        super(weapons,drawAttributes, motionAttributes);
        this.money = money;
        this.level = level;
        this.xp = xp;
    }

    /**
     * Oyuncunun seviyesini artırır ve uygun silahı verir
     */
    levelUp() {
        // Seviye artırma koşulu: XP yeterli mi?
        const xpNeeded = this.xpToLevelUp; // Örnek: seviye başına 100 XP
        if (this.xp >= xpNeeded) {
            this.xp -= xpNeeded;
            this.xpToLevelUp *= 1.5; // Her seviye için gereken XP'yi artır
            this.level++;
            // Seviye arttıkça yeni silah ver
            switch (this.level) {
                case 2:
                    this.weapons.push(ReadyToUseObjects.weapons.REVOLVER.copy());
                    break;
                case 3:
                    this.weapons.push(ReadyToUseObjects.weapons.MACHINE_GUN.copy());
                    break;
                case 4:
                    this.weapons.push(ReadyToUseObjects.weapons.SNIPER.copy());
                    break;
            }
        }
    }

    copy(){
        const weapons = this.weapons.map(weapon => weapon.copy());
        
        const player = new Player(this.money,this.level,this.xp,weapons,this.drawAttributes.copy(),this.motionAttributes.copy());
        player.isAlive = this.isAlive;
        player.canCollide = this.canCollide;
        return player;
    }

}
