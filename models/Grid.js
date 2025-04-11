class Grid {
    /**
     * @param {number} cellSize
     * @param {number} maxHeight
     * @param {number} maxWidth
     * @param {number} destructRange
     */
    constructor(cellSize, maxHeight, maxWidth, destructRange = 2) {
        this.cellSize = cellSize;
        this.destructRange = destructRange;
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;

        /** @type {Map<string, Set<Entity>>} */
        this.cells = new Map();
    }

    /** @param {number} x * @param {number} y  */
    getCellKey(x, y) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }

    /** @param {Entity} entity */
    addEntity(entity) {
        const key = this.getCellKey(entity.drawAttributes.location.x, entity.drawAttributes.location.y);
        if (!this.cells.has(key)) {
            this.cells.set(key, new Set());
        }
        this.cells.get(key).add(entity);
    }

    /** @param {Entity} entity */   
    removeEntity(entity) {
        const key = this.getCellKey(entity.drawAttributes.location.x, entity.drawAttributes.location.y);
        if (this.cells.has(key)) {
            const cell = this.cells.get(key);
            cell.delete(entity);

            if (cell.size === 0)
                this.cells.delete(key);
        }
    }

    /** @param {Entity} entity * @param {number} oldX * @param {number} oldY */  
    updateEntity(entity, oldX, oldY) {
        const oldKey = this.getCellKey(oldX, oldY);
        const newKey = this.getCellKey(entity.drawAttributes.location.x, entity.drawAttributes.location.y);
        
        if (oldKey !== newKey) {
            this.removeEntity(entity);
            this.addEntity(entity);
        }
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} range
     * @returns {Set<Entity>}
     */  
    getEntitiesNearby(x, y, range = 1) {
        const nearbyEntities = new Set();
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const key = this.getCellKey(x + dx * this.cellSize, y + dy * this.cellSize);
                if (this.cells.has(key)) {
                    for (let entity of this.cells.get(key)) {
                        nearbyEntities.add(entity);
                    }
                }
            }
        }
        return nearbyEntities;
    }

    /**
     * @returns {Set<Entity>} 
     */
    getAllEntities(){
        const allEntites = new Set();
        for(let [_,set] of this.cells){
                set.forEach((entity) => allEntites.add(entity));
        }
        return allEntites;
    }

    refreshGrid() {
        const oldCells = this.cells;
        this.cells = new Map();
        oldCells.forEach((entities) =>
            entities.forEach((entity) => {
                if (
                    0 - this.destructRange * this.cellSize < entity.drawAttributes.location.x &&
                    this.maxWidth + this.destructRange * this.cellSize > entity.drawAttributes.location.x &&
                    0 - this.destructRange * this.cellSize < entity.drawAttributes.location.y &&
                    this.maxHeight + this.destructRange * this.cellSize > entity.drawAttributes.location.y &&
                    entity.isAlive
                )
                    this.addEntity(entity);
            })
        );
    }
}
