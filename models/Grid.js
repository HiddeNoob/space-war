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
        oldCells.forEach((partition) =>
            partition.forEach((entities) => {
                entities.forEach((entity) => {
                    const distance = entity.drawAttributes.location.distanceTo(center);
                    if(distance > this.destructRange * this.cellSize || !entity.isAlive){
                        // entity çok uzakta ise sil
                        entity.onDeconstruct.forEach((callback) => callback());
                        return;
                    }; 
                    this.addEntity(entity);
                });
            })
        );
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
     * @param {(entity1: Entity, entity2: Entity) => void} callback - Uygulanacak callback, ilk parametre class1 classından, ikinci parametre class2 sınıfından bir entity
     * @param {string} class1 - İlk entity sınıfı adı (opsiyonel)
     * @param {string} class2 - İkinci entity sınıfı adı (opsiyonel)
     */
    applyToCloseEntityPairs(callback, class1 = null, class2 = null) {

        const processedEntities = new Map();

        for(let [key,_] of this.cells){
            const [x,y] = key.split(",").map((item) => parseInt(item));
            const localEntityMap = this.getEntitiesNearbyByCell(x,y);
            if(class1 === null && class2 === null){ // tüm entity çiftleri için
                const entities = []
                localEntityMap.forEach((entitiesFromCell) => entities.push(...entitiesFromCell));
                this.#processPermutations(entities,entities,processedEntities, callback);
            }
            else if(class1 != null && class2 != null){ // iki sınıf da verilmiş
                this.#processPermutations(localEntityMap.get(class1),localEntityMap.get(class2),processedEntities, callback);
            }else{ // sadece bir sınıf verilmiş
                let reversed = false
                if(class2 != null){
                     // class 2 null değilmiş ancak ben algoritmamı class1'e göre yazdım bu yüzden değiştiriyorum
                    class1 = class2;
                    reversed = true;
                }
                const selectedEntities = []
                const remainedEntities = []
                localEntityMap.forEach((entitiesFromCell, key) => {
                    if (key === class1) {
                        selectedEntities.push(...entitiesFromCell);
                    }
                    else {
                        remainedEntities.push(...entitiesFromCell);
                    }
                });

                // kullanıcı ikinci sınıfı verdiği için seçilenleri ikinci entitye gönderiyorum
                if(reversed) this.#processPermutations(remainedEntities,selectedEntities,processedEntities, callback);

                // kullanıcı ilk sınıfı verdiği için seçilenleri ilk entitye gönderiyorum
                else this.#processPermutations(selectedEntities,remainedEntities,processedEntities, callback);
            }
        }
        
    }

    /**
     * Sadece ekranda görünen grid hücrelerindeki entity çiftleri için çarpışma kontrolü yapar
     * @param {(entity1: Entity, entity2: Entity) => void} callback - Uygulanacak callback
     * @param {Camera} camera - Kamera nesnesi
     */
    applyToVisibleEntityPairs(callback,camera,class1 = null, class2 = null) {
        // Ekranda görünen alanın world koordinatlarını bul

        // ekranın sol üst köşesi oyun haritasında nereye denk geliyor
        const topLeft = camera.screenToWorld(0, 0);

        // ekranın sağ alt köşesi oyun haritasında nereye denk geliyor
        const bottomRight = camera.screenToWorld(global.game.screenWidth, global.game.screenHeight);
        
        // cell boyutuna göre hücrelerin x ve y koordinatlarını hesapla
        const minX = Math.floor(topLeft.x / this.cellSize);
        const minY = Math.floor(topLeft.y / this.cellSize);

        const maxX = Math.ceil(bottomRight.x / this.cellSize);
        const maxY = Math.ceil(bottomRight.y / this.cellSize);

        /** @type {Map<Entity, Set<Entity>>} */
        const processedEntities = new Map();
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const map = this.getEntitiesNearbyByCell(x, y);
                if(class1 === null && class2 === null){
                    const entities = [];
                    map.forEach((entitiesFromCell) => entities.push(...entitiesFromCell));
                    this.#processPermutations(entities, entities, processedEntities, callback);
                }else if(class1 != null && class2 != null){
                    this.#processPermutations(map.get(class1), map.get(class2), processedEntities, callback); 
                }
                else{
                    let reversed = false
                    if(class2 != null){
                        // class 2 null değil
                        // ancak ben algoritmamı class1'e göre yazdım bu yüzden değiştiriyorum
                        class1 = class2;
                        reversed = true;
                    }
                    const selectedEntities = [];
                    map.get(class1)?.forEach((entity) => selectedEntities.push(entity));
                    const remainedEntities = [];
                    map.forEach((entitiesFromCell, key) => {
                        if (key !== class1) {
                            remainedEntities.push(...entitiesFromCell);
                        }else{
                            selectedEntities.push(...entitiesFromCell);
                        }
                    });

                    // kullanıcı ikinci sınıfı verdiği için seçilenleri ikinci entitye gönderiyorum
                    if (reversed) this.#processPermutations(remainedEntities, selectedEntities, processedEntities, callback);

                    // kullanıcı ilk sınıfı verdiği için seçilenleri ilk entitye gönderiyorum
                    else this.#processPermutations(selectedEntities, remainedEntities, processedEntities, callback);
                }   
            }
        }
    }

    /**
     * verilen mape iki entity arası ilişki ekler
     * entity1'e entity2'yi ekler
     * entity2'ye entity1'i ekler
     * böylece iki entity tekrar işlenmemiş olur
     * @param {Entity} entity1 
     * @param {Entity} entity2 
     * @param {Map<Entity, Set<Entity>>} processedEntities 
     */
    #addRelationToEntities(entity1, entity2, processedEntities) {
        if (!processedEntities.has(entity1)) {
            processedEntities.set(entity1, new Set());
        }
        processedEntities.get(entity1).add(entity2);

        if (!processedEntities.has(entity2)) {
            processedEntities.set(entity2, new Set());
        }
        processedEntities.get(entity2).add(entity1);
    }

    /**
     * 
     * @param {Entity[]} entitySet1 
     * @param {Entity[]} entitySet2 
     * @param {Map<Entity, Set<Entity>>} processedEntities // entityler arasında ilişki eklemek için
     * @param {(entity1 : Entity,entity2 : Entity) => void} callback 
     * @returns 
     */
    #processPermutations(entitySet1, entitySet2,processedEntities, callback) {
        if(!(entitySet1 && entitySet2)) return;
        for (let entity1 of entitySet1) {
            for (let entity2 of entitySet2) {

                if (entity1 === entity2) continue;

                if (processedEntities.has(entity1) && processedEntities.get(entity1).has(entity2)) continue; // islenenleri gec
                
                callback(entity1, entity2);
                
                this.#addRelationToEntities(entity1, entity2,processedEntities);
            }
        }
    }
}

