class EntityShell extends Polygon {
    
    /** @type {BreakableLine[]} */
    #breakableLines;

    /**
     * @param {Line[] | Polygon} obj
     * @param {number} health
     * @param {number} durability
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

    /** @param {number} maxHealth */
    setMaxHealth(maxHealth) {
        this.lines.forEach(line => line.maxHealth = maxHealth);
    }

    get lines() {
        return this.#breakableLines;
    }

    /** @param {number} durability */
    setDurability(durability) {
        this.lines.forEach(line => line.durability = durability);
    }

    copy() {
        return new EntityShell(this.lines);
    }
}
