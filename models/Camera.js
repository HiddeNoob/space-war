// Basit bir kamera sistemi. Player'ı ekranın ortasında tutmak için offset hesaplar.
class Camera {
    /**
     * @param {number} screenWidth - Ekranın genişliği.
     * @param {number} screenHeight - Ekranın yüksekliği.
     */
    constructor(screenWidth, screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.offset = { x: 0, y: 0 };
    }

    /**
     * Kameranın offset değerini günceller.
     * @param {Vector} playerPosition - Oyuncunun dünya koordinatındaki pozisyonu.
     * @returns {void}
     */
    update(playerPosition) {
        this.offset.x = this.screenWidth / 2 - playerPosition.x;
        this.offset.y = this.screenHeight / 2 - playerPosition.y;
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
