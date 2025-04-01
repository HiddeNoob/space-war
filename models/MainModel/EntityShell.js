class EntityShell{

    /** @type {BreakableLine[]} */
    breakableLines

    /** @param {Polygon} polygon */
    constructor(polygon){
        this.breakableLines = polygon.lines.map((line) => new BreakableLine(line))
    }
}