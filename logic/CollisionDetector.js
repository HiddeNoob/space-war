class CollisionDetector{
    /** @type {Grid} grid */
    #grid;

    /** @param {Grid} grid */
    constructor(grid){
        this.#grid = grid;
    }

    /**
     * 
     * @param {Entity} e1 
     * @param {Entity} e2 
     * @returns {BreakableLine[]}
     */
    #getCollidingLinesIfExists(e1,e2){
        e1.drawAttributes.shell.breakableLines.forEach((e1L) => {
            e2.drawAttributes.shell.breakableLines.forEach((e2L) => {
                if(e1L.isIntersectsWith(e2L))
                    return [e1L,e2L]
            })
        })
        return [];
    }

    makeCollisions() {

    }
}