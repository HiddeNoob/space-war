class BreakableLine extends Line{
    /** @type {number} */
    health

    /** @type {number} */
    durability

    /**
     * @param {Line} line
     * @param {number} health
     */
    constructor(line, health = 10,durability = 100) {
        super(line.startPoint.data[0], line.startPoint.data[1], line.endPoint.data[0], line.endPoint.data[1]);
        this.health = health;
    }

}