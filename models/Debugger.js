// Debug işlemleri için merkezi bir sınıf
class Debugger {
    /** @type {CanvasRenderingContext2D} */
    static ctx = null;
    /** @type {Camera} */
    static camera = null;
    /** @type {object} */
    static debug = null;

    /**
     * Başlangıçta ctx, camera ve debug referanslarını ayarla
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     * @param {object} debug
     */
    static setup(ctx, camera, debug) {
        Debugger.ctx = ctx;
        Debugger.camera = camera;
        Debugger.debug = debug;
    }

    /** @param {Vector} vector */
    static showPoint(vector) {
        if (!Debugger.debug.showPoint) return;
        let v = vector;
        v = Debugger.camera.worldToScreen(vector.x, vector.y);
        Debugger.ctx.beginPath();
        Debugger.ctx.arc(v.x, v.y, 1, 0, 2 * Math.PI);
        Debugger.ctx.stroke();
    }

    /** @param {Vector} vector */
    static drawVector(vector, startVector = new Vector(0, 0), color = "white", kalinlik = 4) {
        if (!Debugger.debug?.showPoint) return;
        let s = startVector;
        s = Debugger.camera.worldToScreen(startVector.x, startVector.y);
        Debugger.ctx.strokeStyle = color;
        Debugger.ctx.lineWidth = kalinlik;
        Debugger.ctx.beginPath();
        Debugger.ctx.moveTo(s.x, s.y);
        Debugger.ctx.lineTo(vector.x + s.x, vector.y + s.y);
        Debugger.ctx.stroke();
    }

    /**
     * Grid hücrelerindeki entity sayılarını ve grid çizgilerini çizer
     * @param {Grid} grid
     * @param {Camera} camera
     */
    static showGrid(grid, camera) {
        const cellSize = grid.cellSize;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        // Ekranda görünen alanın world koordinatlarını bul
        const topLeft = camera.screenToWorld(0, 0);
        const bottomRight = camera.screenToWorld(grid.maxWidth, grid.maxHeight);
        // Grid hücre aralığını hesapla
        const minX = Math.floor(topLeft.x / cellSize);
        const minY = Math.floor(topLeft.y / cellSize);
        const maxX = Math.ceil(bottomRight.x / cellSize);
        const maxY = Math.ceil(bottomRight.y / cellSize);
        for (let i = minY; i <= maxY; i++) {
            for (let j = minX; j <= maxX; j++) {
                const x = j * cellSize;
                const y = i * cellSize;
                let totalEntities = 0;
                const selectedEntities = grid.cells.get(grid.getCellKey(x, y));
                selectedEntities?.forEach((set) => totalEntities += set.size);
                // Kamera offsetini uygula
                const screenPos = camera.worldToScreen(x, y);
                ctx.fillText(totalEntities.toString(), screenPos.x + 5, screenPos.y + 10);
                ctx.moveTo(screenPos.x, screenPos.y);
                const screenPosRight = camera.worldToScreen(x + cellSize, y);
                ctx.lineTo(screenPosRight.x, screenPosRight.y);
                const screenPosDown = camera.worldToScreen(x, y + cellSize);
                ctx.moveTo(screenPosDown.x, screenPosDown.y);
                ctx.lineTo(screenPos.x, screenPos.y);
            }
        }
        ctx.stroke();
    }

    /**
     * FPS bilgisini ekrana yazar
     * @param {number} timestamp
     * @param {number} lastPaintTimestamp
     */
    static showFPS(timestamp, lastPaintTimestamp) {
        ctx.font = "12px serif";
        ctx.fillStyle = "white";
        ctx.fillText((`${(1000 / (timestamp - lastPaintTimestamp)).toFixed(2)} FPS`), 10, 20);
    }
}