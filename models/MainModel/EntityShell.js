class EntityShell{

    /** @type {BreakableLine[]} */
    breakableLines

    /** @param {Polygon} polygon */
    constructor(polygon,health = 100,durability = 10){
        this.breakableLines = polygon.lines.map((line) => new BreakableLine(line,health,durability))
    }

    copy(){
        return new EntityShell(new Polygon(this.breakableLines))
    }

    /** @param {number} maxHealth */
    setMaxHealth(maxHealth){
        this.breakableLines.forEach((line) => line.maxHealth = maxHealth);
    }
    /** @param {number} durability */
    setDurability(durability){
        this.breakableLines.forEach((line) => line.durability = durability);
    }

}