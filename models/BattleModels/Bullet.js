// Oyunda ateşlenen mermileri (bullet) temsil eden sınıf
class Bullet extends Entity{
    /** @type {number} */
    damage = 0; // Merminin verdiği hasar

    /**
     * Bullet oluşturucu
     * @param {number} damage - Mermi hasarı
     * @param {DrawAttributes} drawOptions - Çizim özellikleri
     * @param {MotionAttributes} motionAttributes - Fiziksel özellikler
     */
    constructor(damage = 5,drawOptions = new DrawAttributes(BulletShapes.DEFAULT_BULLET),motionAttributes = new MotionAttributes(10,1,1)){
        super(drawOptions,motionAttributes);
        this.drawAttributes.shell.setDurability(1);
        this.damage = damage;
    }

    /**
     * Merminin kopyasını oluşturur
     * @returns {Bullet}
     */
    copy(){
        return new Bullet(this.damage,this.drawAttributes.copy(),this.motionAttributes.copy());
    }
}