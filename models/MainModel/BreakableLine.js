class BreakableLine extends Line{
    /** @type {number} */
    health

    /** @type {number} */
    durability

    /**
     * @param {Line} line
     * @param {number} health
     */
    constructor(line,health = 10,durability = 100) {
        super(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y,line.lineWidth,line.lineColor);
        this.health = health;
        this.durability = durability;
    }

    copy() {
        return new BreakableLine(
            super.copy(),
            this.health,
            this.durability
        );
    }

}