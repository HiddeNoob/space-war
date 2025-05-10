// Basit bir kamera sistemi. Player'ı ekranın ortasında tutmak için offset hesaplar.
class Camera {

    /** @type {Entity} */
    trackedEntity; // Şu anda takip edilen entity

    offset; // Kamera offseti

    /**
     * @param {Entity} entityToTrack - Takip edilecek entity.
     * @param {number} screenWidth - Ekranın genişliği.
     * @param {number} screenHeight - Ekranın yüksekliği.
     */
    constructor(entityToTrack,screenWidth, screenHeight) {
        this.setTrackedEntity(entityToTrack);
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.offset = entityToTrack.drawAttributes.location.copy();
    }

    /**
     * Kamerayı seçilmiş entity'ye göre günceller.
     */
    updateOffset(dt){
        const dx = this.screenWidth / 2 - this.trackedEntity.drawAttributes.location.x;
        const dy = this.screenHeight / 2 - this.trackedEntity.drawAttributes.location.y;
        this.offset.x += (dx - this.offset.x) * 0.001 * dt;
        this.offset.y += (dy - this.offset.y) * 0.001 * dt;
    }

    /**
     * Verilen entity'yi takip etmeye başlar.
     * @param {Entity} entity 
     */
    setTrackedEntity(entity){
        if(!entity) throw new Error("you must provide an entity to track");
        this.trackedEntity = entity;
    }

    /**
     * Gerçek dünya koordinatını ekrana çevirir.
     * @param {number} worldX - Dünya koordinatında X değeri.
     * @param {number} worldY - Dünya koordinatında Y değeri.
     * @returns {Vector} - Ekran koordinatında Vector nesnesi.
     */
    worldToScreen(worldX, worldY) {
        return new Vector(
            worldX + this.offset.x,
            worldY + this.offset.y
        );
    }

    /**
     * Ekran koordinatını dünya koordinatına çevirir.
     * @param {number} screenX - Ekran koordinatında X değeri.
     * @param {number} screenY - Ekran koordinatında Y değeri.
     * @returns {Vector} - Dünya koordinatında Vector nesnesi.
     */
    screenToWorld(screenX, screenY) {
        return new Vector(
            screenX - this.offset.x,
            screenY - this.offset.y
        );
    }
}
