// Oyunda toplanabilen sağlık paketi (health) objesini temsil eden sınıf
class Health extends Entity{
    // healPercent: fraction of max health restored per pickup (e.g. 0.1 for 10%)
    healPercent = 0.1;

    /**
     * Health oluşturucu
     * @param {number} healPercent - Toplandığında verilecek sağlık yüzdesi (0..1)
     * @param {DrawAttributes} drawAttributes - Çizim özellikleri
     * @param {MotionAttributes} motionAttributes - Fiziksel özellikler
     */
    constructor(healPercent,drawAttributes = new DrawAttributes(ShapeFactory.polygonToShell(ShapeFactory.createPlus(24,"lime",2)),new Vector(0,0)),motionAttributes = new MotionAttributes()){
        super(drawAttributes,motionAttributes);
        this.healPercent = healPercent;
        // Make health pickups move noticeably slower than coins/xp:
        this.motionAttributes.maxVelocity = 2;
        this.motionAttributes.velocitySlowdownRate = 0.98;
        this.motionAttributes.mass = 0.2;
        this.canCollide = false;
    }

    /**
     * Kolayca health oluşturmak için yardımcı fonksiyon
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     * @param {number} healPercent - Verilecek sağlık yüzdesi (0..1)
     * @param {number} size - Health objesinin boyutu
     * @returns {Health}
     */
    static create(x,y,healPercent = 0.1,size = 14){
        return new Health(healPercent,new DrawAttributes(ShapeFactory.polygonToShell(ShapeFactory.createPlus(size,"lime",2)),new Vector(x,y)))
    }
}
