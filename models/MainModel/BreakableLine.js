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
     * @param {number} maxHealth - Maksimum sağlık
     * @param {number} currentHealth - Başlangıç sağlığı
     * @param {number} durability - Dayanıklılık katsayısı
     */
    constructor(line,currentHealth = 100,maxHealth = 100,durability = 10) {
        super(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y,line.lineWidth,line.lineColor);
        this.health = currentHealth;
        this.maxHealth = maxHealth;
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
            this.maxHealth,
            this.durability
        );
    }

    
}