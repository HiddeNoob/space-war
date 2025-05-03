// Bir entity'nin kabuğunu oluşturan ve çizgileri kırılabilir yapan sınıf
class EntityShell extends Polygon {
    /** @type {BreakableLine[]} */
    #breakableLines; // Kırılabilir çizgiler

    /**
     * EntityShell oluşturucu
     * @param {Line[] | Polygon} obj - Çizgi dizisi veya Polygon
     * @param {number} health - Çizgilerin başlangıç sağlığı
     * @param {number} durability - Çizgilerin dayanıklılığı
     */
    constructor(obj, health = 100, durability = 10) {
        if(obj instanceof Polygon) {
            obj = obj.copy().lines;
        }
        const breakableLines = obj.map(line =>
            new BreakableLine(line, health, durability)
        );
        super(breakableLines);
        this.#breakableLines = breakableLines;
    }

    /**
     * Tüm çizgilerin maksimum sağlığını ayarlar
     * @param {number} maxHealth
     */
    setMaxHealth(maxHealth) {
        this.lines.forEach(line => line.maxHealth = maxHealth);
    }

    /**
     * Kırılabilir çizgileri döndürür
     */
    get lines() {
        return this.#breakableLines;
    }

    /**
     * Tüm çizgilerin dayanıklılığını ayarlar
     * @param {number} durability
     */
    setDurability(durability) {
        this.lines.forEach(line => line.durability = durability);
    }

    /**
     * EntityShell'in kopyasını oluşturur
     * @returns {EntityShell}
     */
    copy() {
        return new EntityShell(this.lines);
    }
}
