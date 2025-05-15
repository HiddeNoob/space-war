// Oyunda toplanabilen para (coin) objesini temsil eden sınıf
class Coin extends Entity{
    value = 1; // Coin'in değeri

    /**
     * Coin oluşturucu
     * @param {number} value - Coin değeri
     * @param {DrawAttributes} drawAttributes - Çizim özellikleri
     * @param {MotionAttributes} motionAttributes - Fiziksel özellikler
     */
    constructor(value,drawAttributes = new DrawAttributes(ShapeFactory.polygonToShell(ShapeFactory.createRegularPolygon(8,20))),motionAttributes = new MotionAttributes()){
        super(drawAttributes,motionAttributes);
        this.value = value;
        this.motionAttributes.velocitySlowdownRate = 0.99
        this.canCollide = false;
    }

    /**
     * Kolayca coin oluşturmak için yardımcı fonksiyon
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     * @param {number} value - Coin değeri
     * @param {number} size - Coin boyutu
     * @returns {Coin}
     */
    static create(x,y,value = 1,size = 5){
        return new Coin(value,new DrawAttributes(ShapeFactory.polygonToShell(ShapeFactory.createRegularPolygon(10,size,"yellow",2)),new Vector(x,y)))
    }
}