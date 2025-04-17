class Grid {
    static cellSize = Settings.default.gridCellSize;
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

        /** @type {Map<string, Map<string, Set<Entity>>>} */
        this.cells = new Map();
    }

    /** @param {number} x * @param {number} y  */
    getCellKey(x, y) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }

    /** @param {Entity} entity */
    addEntity(entity) {
        const key = this.getCellKey(
            entity.drawAttributes.location.x,
            entity.drawAttributes.location.y
        );
        if (!this.cells.has(key)) {
            this.cells.set(key, new Map());
        }
        const entityClassName = entity.constructor.name;
        if (!this.cells.get(key).get(entityClassName)) {
            this.cells.get(key).set(entityClassName, new Set());
        }
        this.cells.get(key).get(entityClassName).add(entity);
    }

    /** @param {Entity} entity */
    removeEntity(entity) {
        const key = this.getCellKey(
            entity.drawAttributes.location.x,
            entity.drawAttributes.location.y
        );
        if (this.cells.has(key)) {
            const cellSet = this.cells.get(key).get(entity.constructor.name);
            cellSet.delete(entity);
        }
    }

    /** @param {Entity} entity * @param {number} oldX * @param {number} oldY */
    updateEntity(entity, oldX, oldY) {
        const oldKey = this.getCellKey(oldX, oldY);
        const newKey = this.getCellKey(
            entity.drawAttributes.location.x,
            entity.drawAttributes.location.y
        );

        if (oldKey !== newKey) {
            this.removeEntity(entity);
            this.addEntity(entity);
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} range
     * @returns {Map<string,Set<Entity>>}
     */
    getEntitiesNearby(x, y, range = 1) {
        /** @type {Map<string,Set<Entity>>} */
        const nearbyEntities = new Map();
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const key = this.getCellKey(
                    x + dx * this.cellSize,
                    y + dy * this.cellSize
                );
                if (this.cells.has(key)) {
                    for (let [entityClassName, entities] of this.cells.get(key)) {
                        if(!nearbyEntities.has(entityClassName)) nearbyEntities.set(entityClassName,new Set());
                        entities.forEach((entity) => nearbyEntities.get(entityClassName).add(entity));
                    }
                }
            }
        }
        return nearbyEntities;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} range 
     * @returns {Map<string,Entity[]>}
     */
    getEntitiesNearbyByCell(x,y,range = 1){
        const nearbyEntities = new Map();
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const key = this.getCellKey(
                    (dx + x) * this.cellSize,
                    (dy + y) * this.cellSize
                );
                if (this.cells.has(key)) {
                    for (let [entityClassName, entities] of this.cells.get(key)) {
                        if(!nearbyEntities.has(entityClassName)) nearbyEntities.set(entityClassName,new Set());
                        entities.forEach((entity) => nearbyEntities.get(entityClassName).add(entity));
                    }
                }
            }
        }
        return nearbyEntities;
    }

    /**
     * @returns {Map<String,Set<Entity>>}
     */
    getAllEntities() {
        /** @type {Map<String,Set<Entity>>}  */
        const allEntites = new Map();
        for (let [_, map] of this.cells) {
            map.forEach((value, key) => {
                if (!allEntites.has(key)) allEntites.set(key, new Set());
                value.forEach((entity) => allEntites.get(key).add(entity));
            });
        }
        return allEntites;
    }

    refreshGrid() {
        const oldCells = this.cells;
        this.cells = new Map();
        oldCells.forEach((partition) =>
            partition.forEach((entities) => {
                entities.forEach((entity) => {
                    if (
                        0 - this.destructRange * this.cellSize <
                        entity.drawAttributes.location.x &&
                        this.maxWidth + this.destructRange * this.cellSize >
                        entity.drawAttributes.location.x &&
                        0 - this.destructRange * this.cellSize <
                        entity.drawAttributes.location.y &&
                        this.maxHeight + this.destructRange * this.cellSize >
                        entity.drawAttributes.location.y &&
                        entity.isAlive
                    )
                        this.addEntity(entity);
                });
            })
        );
    }

    /**
     * @param {(entity: Entity) => void} callback
     */
    applyToAllEntities(callback) {
        this.cells.forEach((map) => {
            map.forEach((setOfEntities) => {
                setOfEntities.forEach((entity) => {
                    callback(entity);
                });
            });
        });
    }

    /**
     * @param {(entity: Entity) => void} callback
     * @param {string} className
     */
    applyToCertainEntities(className,callback){
        this.cells.forEach((map) => {
            const entities = map.get(className)
            if(entities){
                for(let entity of map.get(className)){
                    callback(entity);
                }
            }
        });
    }

    /** 
     * @param {(entity1: Entity, entity2: Entity) => void} callback 
     * @param {string} class1
     * @param {string} class2
     * @description class verilirse isimleri eşleşen yakındakı objelere callbacki çalıştırır değilse her yakın olan obje ikilisi için yapar
    */
    applyToCloseEntityPairs(callback, class1 = null, class2 = null) {

        if(class1 == null && class2 != null){
            class1 = class2;
            class2 = null;            
        }

        /** @type {Map<Entity, Set<Entity>>} */
        const processedEntities = new Map();

        const addRelation = (entity1, entity2) => {
            if (!processedEntities.has(entity1)) {
                processedEntities.set(entity1, new Set());
            }
            processedEntities.get(entity1).add(entity2);

            if (!processedEntities.has(entity2)) {
                processedEntities.set(entity2, new Set());
            }
            processedEntities.get(entity2).add(entity1);
        };

        for(let y = 0; y < Math.ceil(this.maxHeight / this.cellSize) ; y++){
            for(let x = 0; x < Math.ceil(this.maxWidth / this.cellSize) ; x++){
                const map = this.getEntitiesNearbyByCell(x,y);
                if(class1 === null && class2 === null){
                    const entities = []
                    map.forEach((entitiesFromCell) => entities.push(...entitiesFromCell));
                    entities.forEach((entity1) => {
                        entities.forEach((entity2) => {
                            if (entity1 === entity2) return;

                            if (processedEntities.has(entity1) && processedEntities.get(entity1).has(entity2)) return; // islenenleri gec
                            
                            callback(entity1, entity2);
                            addRelation(entity1, entity2);
                        });
                    })
                }
                else if(class1 != null){
                    const selectedEntities = map.get(class1)
                    map.delete(class1);
                    const remainedEntities = []
                    map.forEach((entitiesFromCell) => remainedEntities.push(entitiesFromCell));
                    remainedEntities.forEach((remainedEntity) => {
                        selectedEntities.forEach((selectedEntity) => {
                            callback(remainedEntity, selectedEntity);
                        })
                    })
                }

            }
        }
        
    }
}

