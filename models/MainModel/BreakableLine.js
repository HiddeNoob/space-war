// Sağlığı ve dayanıklılığı olan, kırılabilir çizgi sınıfı
class BreakableLine extends Line{
    /** @type {number} */
    maxHealth // Çizginin maksimum sağlığı

    /** @type {number} */
    health // Çizginin mevcut sağlığı

    /** @type {number} */
    durability // Çizginin dayanıklılık katsayısı

    /**
     * BreakableLine oluşturucu
     * @param {Line} line - Temel çizgi
     * @param {number} health - Başlangıç sağlığı
     * @param {number} durability - Dayanıklılık katsayısı
     */
    constructor(line,health = 10,durability = 100) {
        super(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y,line.lineWidth,line.lineColor);
        this.belongsTo = line.belongsTo;
        this.health = health;
        this.maxHealth = health;
        this.durability = durability;
    }

    /**
     * Kırılabilir çizginin kopyasını oluşturur
     * @returns {BreakableLine}
     */
    copy() {
        return new BreakableLine(
            super.copy(),
            this.health,
            this.durability
        );
    }

    
}