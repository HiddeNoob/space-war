// Basit bir kamera sistemi. Player'ı ekranın ortasında tutmak için offset hesaplar.
class Camera {
    /**
     * @param {number} screenWidth
     * @param {number} screenHeight
     */
    constructor(screenWidth, screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.offset = { x: 0, y: 0 };
    }

    /**
     * Player'ın konumuna göre offset'i günceller.
     * @param {Vector} playerPosition
     */
    update(playerPosition) {
        this.offset.x = this.screenWidth / 2 - playerPosition.x;
        this.offset.y = this.screenHeight / 2 - playerPosition.y;
    }

    /**
     * Gerçek dünya koordinatını ekrana çevirir.
     * @param {number} worldX
     * @param {number} worldY
     * @returns {Vector}
     */
    worldToScreen(worldX, worldY) {
        return new Vector(
            worldX + this.offset.x,
            worldY + this.offset.y
        );
    }

    /**
     * Ekran koordinatını dünya koordinatına çevirir.
     * @param {number} screenX
     * @param {number} screenY
     * @returns {Vector}
     */
    screenToWorld(screenX, screenY) {
        return new Vector(
            screenX - this.offset.x,
            screenY - this.offset.y
        );
    }
}
