// Oyunda toplanabilen sağlık paketi (health) objesini temsil eden sınıf
class Health extends Entity{
    healValue = 25; // Toplandığında verilecek sağlık miktarı

    /**
     * Health oluşturucu
     * @param {number} healValue - Toplandığında verilecek sağlık
     * @param {DrawAttributes} drawAttributes - Çizim özellikleri
     * @param {MotionAttributes} motionAttributes - Fiziksel özellikler
     */
    constructor(healValue,drawAttributes = new DrawAttributes(ShapeFactory.polygonToShell(ShapeFactory.createRegularPolygon(8,20,"lime",2)),new Vector(0,0)),motionAttributes = new MotionAttributes()){
        super(drawAttributes,motionAttributes);
        this.healValue = healValue;
        this.motionAttributes.velocitySlowdownRate = 0.99
        this.canCollide = false;
    }

    /**
     * Kolayca health oluşturmak için yardımcı fonksiyon
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     * @param {number} healValue - Verilecek sağlık miktarı
     * @param {number} size - Health objesinin boyutu
     * @returns {Health}
     */
    static create(x,y,healValue = 25,size = 6){
        return new Health(healValue,new DrawAttributes(ShapeFactory.polygonToShell(ShapeFactory.createRegularPolygon(8,size,"lime",2)),new Vector(x,y)))
    }
}
