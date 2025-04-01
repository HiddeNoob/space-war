class BreakableLine extends Line{
    /** @type {number} */
    health

    /**
     * @param {Line} line
     * @param {number} health
     */
    constructor(line, health = 10) {
        super(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y);
        this.health = health;
    }

}