// Oyunda ateşlenen mermileri (bullet) temsil eden sınıf
class Bullet extends Entity{
    /** @type {number} */
    damage; // Merminin verdiği hasar

    /**
     * Bullet oluşturucu
     * @param {number} damage - Mermi hasarı
     * @param {DrawAttributes} drawOptions - Çizim özellikleri
     * @param {MotionAttributes} motionAttributes - Fiziksel özellikler
     */
    constructor(damage = 1,drawOptions = new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.DEFAULT_BULLET)),motionAttributes = new MotionAttributes(10,10)){
        super(drawOptions,motionAttributes);
        this.damage = damage;
    }
    /**
     * @param {number} damage 
     * @returns {this}
     */
    setDamage(damage){
        this.damage = damage;
        return this;
    }

    /**
     * Merminin kopyasını oluşturur
     * @returns {Bullet}
     */
    copy(){
        return new Bullet(this.damage,this.drawAttributes.copy(),this.motionAttributes.copy());
    }
}