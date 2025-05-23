// Debug işlemleri için merkezi bir sınıf
// Oyun içi debug çizimleri ve FPS/grid gösterimi bu sınıf üzerinden yapılır
class Debugger {
    /** @type {CanvasRenderingContext2D} */
    static #ctx = null; // Çizim bağlamı (statik)

    /** @type {Camera} */
    static #camera = null; // Kamera referansı (statik)

    /** @type {Game} */
    static #game = null; // Oyun referansı (statik)

    static #debug = Settings.default.debug; // Debug ayarları (statik)

    /**
     * Başlangıçta canvas referansını ayarla
     * @param {Game} game - Canvas nesnesi
     */
    static setup(game,ctx) {
        Debugger.#ctx = ctx;
        Debugger.#game = game;
        Debugger.#camera = game.canvasObject.camera;
        Debugger.#debug = Settings.default.debug;

        const setObjectValuesFalse = (object) => {
            for (const key in object) {
                if (typeof object[key] === "object") {
                    setObjectValuesFalse(object[key]);
                } else {
                    object[key] = false;
                }
            }
        }

        
    }


    /**
     * Bir vektörün ekranda nokta olarak gösterilmesini sağlar
     * @param {Vector} vector - Gösterilecek vektör
     * @param {string} color - Nokta rengi
     * @param {number} radius - Nokta yarıçapı
     */
    static showPoint(vector,color = "white",radius = 1) {
        if(!Settings.default.debugMode) return;

        let v = vector;
        v = Debugger.#camera.worldToScreen(vector.x, vector.y);
        Debugger.#ctx.fillStyle = color;
        Debugger.#ctx.beginPath();
        Debugger.#ctx.arc(v.x, v.y, radius, 0, 2 * Math.PI);
        Debugger.#ctx.stroke();
    }

    /**
     * İki vektör arasında çizgi çizer
     * @param {Vector} vector - Çizilecek vektör
     * @param {Vector} [startVector] - Başlangıç noktası
     * @param {string} [color] - Çizgi rengi
     * @param {number} [kalinlik] - Çizgi kalınlığı
     */
    static drawVector(vector, startVector = new Vector(0, 0), color = "white", kalinlik = 4) {
        if(!Settings.default.debugMode) return;

        let s = startVector;
        s = Debugger.#camera.worldToScreen(startVector.x, startVector.y);
        Debugger.#ctx.strokeStyle = color;
        Debugger.#ctx.lineWidth = kalinlik;
        Debugger.#ctx.beginPath();
        Debugger.#ctx.moveTo(s.x, s.y);
        Debugger.#ctx.lineTo(vector.x + s.x, vector.y + s.y);
        Debugger.#ctx.stroke();
    }

    static #setStyle(){
        Debugger.#ctx.fillStyle = "white";
        Debugger.#ctx.strokeStyle = "white";
        Debugger.#ctx.lineWidth = 1;
        Debugger.#ctx.font = "10px undertale-font";
    }

    /**
     * Grid hücrelerindeki entity sayılarını ve grid çizgilerini çizer
     * @param {Grid} grid - Grid nesnesi
     */
    static showGrid(grid) {


        const cellSize = grid.cellSize;
        Debugger.#setStyle();
        Debugger.#ctx.beginPath();
        // Ekranda görünen alanın world koordinatlarını bul
        const topLeft = this.#camera.screenToWorld(0, 0);
        const bottomRight = this.#camera.screenToWorld(grid.maxWidth, grid.maxHeight);
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
                const screenPos = this.#camera.worldToScreen(x, y);
                
                const screenPosRight = this.#camera.worldToScreen(x + cellSize, y);
                const screenPosDown = this.#camera.worldToScreen(x, y + cellSize);
                Debugger.#ctx.moveTo(screenPos.x, screenPos.y);
                Debugger.#ctx.lineTo(screenPosRight.x, screenPosRight.y);
                Debugger.#ctx.moveTo(screenPos.x, screenPos.y);
                Debugger.#ctx.lineTo(screenPosDown.x, screenPosDown.y);
                
                if(Settings.default.debugMode){

                    if (Debugger.#debug.grid.entityCount) {
                        Debugger.#ctx.fillText(`${totalEntities} ${x},${y}`, screenPos.x + 5, screenPos.y + 10);
                    }
                    
                }
            }
        }
        Debugger.#ctx.stroke();
    }

    /**
     * FPS bilgisini ekrana yazar
     * @param {number} timestamp - Şu anki zaman
     * @param {number} lastPaintTimestamp - Son çizim zamanı
     */
    static showFPS(timestamp, lastPaintTimestamp) {
        if(!Settings.default.debugMode) return;
        if (!Debugger.#debug.fps) return;
        Debugger.#setStyle();
        Debugger.#ctx.fillText((`${(1000 / (timestamp - lastPaintTimestamp)).toFixed(2)} FPS`), 10, 20);
    }

    /**
     * @param {String} text 
     * @param {Number} x 
     * @param {Number} y 
     */
    static writeText(text, x, y) {
        if(!Settings.default.debugMode) return;
        Debugger.#setStyle();
        Debugger.#ctx.fillText(text, x, y);
    }
}