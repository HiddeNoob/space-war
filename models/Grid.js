class Grid {
    /** @param {number} cellSize */
    constructor(cellSize) {
        this.cellSize = cellSize;

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

    /** @param {number} x * @param {number} y * @param {number} range */  
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
        return Array.from(nearbyEntities);
    }
}
