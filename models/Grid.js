// Oyun dünyasını grid hücrelerine bölen ve entity yönetimini kolaylaştıran sınıf
class Grid {
    static cellSize = Settings.default.gridCellSize; // Varsayılan grid hücre boyutu
    /**
     * Grid oluşturucu
     * @param {number} cellSize - Hücre boyutu
     * @param {number} maxHeight - Grid yüksekliği
     * @param {number} maxWidth - Grid genişliği
     * @param {number} destructRange - Yıkım aralığı (varsayılan: 20)
     */
    constructor(cellSize, maxHeight, maxWidth, destructRange = 20) {
        this.cellSize = cellSize;
        this.destructRange = destructRange;
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;
        /** @type {Map<string, Map<string, Set<Entity>>>} */
        this.cells = new Map(); // Grid hücreleri
    }

    /**
     * Hücre anahtarını hesaplar
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     * @returns {string} Hücre anahtarı
     */
    getCellKey(x, y) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }

    /**
     * Entity'i grid'e ekler
     * @param {Entity} entity - Eklenecek entity
     */
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

    /**
     * Entity'i grid'den kaldırır
     * @param {Entity} entity - Kaldırılacak entity
     */
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

    /**
     * Entity'in konumunu günceller
     * @param {Entity} entity - Güncellenecek entity
     * @param {number} oldX - Eski X koordinatı
     * @param {number} oldY - Eski Y koordinatı
     */
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
     * Belirli bir konum ve aralıkta bulunan entity'leri döndürür
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     * @param {number} range - Aralık (varsayılan: 1)
     * @returns {Map<string,Set<Entity>>} Yakındaki entity'ler
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
     * Belirli bir hücre ve aralıkta bulunan entity'leri döndürür
     * @param {number} x - Hücre X koordinatı
     * @param {number} y - Hücre Y koordinatı
     * @param {number} range - Aralık (varsayılan: 1)
     * @returns {Map<string,Entity[]>} Yakındaki entity'ler
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
     * Grid'deki tüm entity'leri döndürür
     * @returns {Map<String,Set<Entity>>} Tüm entity'ler
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

    /**
     * Grid'i yeniler
     * @param {Vector} center - Yenileme merkezi (varsayılan: 0,0)
     */
    refreshGrid(center = new Vector(0, 0)) {
        const oldCells = this.cells;
        this.cells = new Map();
        const deletedEntites = [];
        oldCells.forEach((partition) =>
            partition.forEach((entities) => {
                entities.forEach((entity) => {
                    const distance = entity.drawAttributes.location.distanceTo(center);
                    if(distance > this.destructRange * this.cellSize){// entity çok uzakta ise sil
                        deletedEntites.push(entity);
                        return;
                    }; 
                    this.addEntity(entity);
                });
            })
        );
        if(deletedEntites.length > 0) {
            console.log("entityler silindi");
            console.log(deletedEntites);
        }
    }

    /**
     * Tüm entity'lere verilen callback'i uygular
     * @param {(entity: Entity) => void} callback - Uygulanacak callback
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
     * Belirli bir sınıfa ait entity'lere verilen callback'i uygular
     * @param {string} className - Entity sınıfı adı
     * @param {(entity: Entity) => void} callback - Uygulanacak callback
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
     * Yakındaki entity çiftlerine verilen callback'i uygular
     * @param {(entity1: Entity, entity2: Entity) => void} callback - Uygulanacak callback
     * @param {string} class1 - İlk entity sınıfı adı (opsiyonel)
     * @param {string} class2 - İkinci entity sınıfı adı (opsiyonel)
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

    /**
     * Sadece ekranda görünen grid hücrelerindeki entity çiftleri için çarpışma kontrolü yapar
     * @param {(entity1: Entity, entity2: Entity) => void} callback - Uygulanacak callback
     * @param {Camera} camera - Kamera nesnesi
     * @param {string} class1 - İlk entity sınıfı adı (opsiyonel)
     * @param {string} class2 - İkinci entity sınıfı adı (opsiyonel)
     */
    applyToVisibleEntityPairs(callback,camera,class1 = null, class2 = null) {
        const cellSize = this.cellSize;
        // Ekranda görünen alanın world koordinatlarını bul
        const topLeft = camera.screenToWorld(0, 0);
        const bottomRight = camera.screenToWorld(global.game.screenWidth, global.game.screenHeight);
        const minX = Math.floor(topLeft.x / cellSize);
        const minY = Math.floor(topLeft.y / cellSize);
        const maxX = Math.ceil(bottomRight.x / cellSize);
        const maxY = Math.ceil(bottomRight.y / cellSize);
        /** @type {Map<Entity, Set<Entity>>} */
        const processedEntities = new Map();
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const map = this.getEntitiesNearbyByCell(x, y);
                if(class1 === null && class2 === null){
                    const entities = [];
                    map.forEach((entitiesFromCell) => entities.push(...entitiesFromCell));
                    entities.forEach((entity1) => {
                        entities.forEach((entity2) => {
                            if (entity1 === entity2) return;
                            if (processedEntities.has(entity1) && processedEntities.get(entity1).has(entity2)) return;
                            callback(entity1, entity2);
                            if (!processedEntities.has(entity1)) processedEntities.set(entity1, new Set());
                            processedEntities.get(entity1).add(entity2);
                            if (!processedEntities.has(entity2)) processedEntities.set(entity2, new Set());
                            processedEntities.get(entity2).add(entity1);
                        });
                    });
                } else if(class1 != null){
                    const selectedEntities = map.get(class1);
                    const remainedEntities = [];
                    map.forEach((entitiesFromCell, key) => {
                        if (key !== class1) {
                            remainedEntities.push(...entitiesFromCell);
                        }
                    });
                    remainedEntities.forEach((remainedEntity) => {
                        selectedEntities?.forEach((selectedEntity) => {
                            callback(remainedEntity, selectedEntity);
                        });
                    });
                }
            }
        }
    }
}

