// Oyun ekranı ve çizim işlemlerini yöneten ana sınıf
// Canvas, oyun içi tüm çizim işlemlerini kapsar ve kamera ile grid yönetimini içerir
class Canvas{
    /** @type {HTMLCanvasElement} */
    #canvasHTMLElement; // Canvas HTML elementi
    /** @type {CanvasRenderingContext2D} */
    #ctx; // Çizim bağlamı
    
    /** @type {Grid} */
    grid // Oyun grid'i

    width = 0; // Canvas genişliği
    height = 0; // Canvas yüksekliği

    /** @type {number} */
    lastPaintTimestamp; // Son çizim zamanı

    /** @type {Camera} */
    camera; // Oyun kamerası
    
    /**
     * Canvas nesnesi oluşturur
     * @param {CanvasRenderingContext2D} ctx - Çizim bağlamı
     * @param {HTMLCanvasElement} canvasHTMLElement - Canvas HTML elementi
     */
    constructor(ctx,canvasHTMLElement){
        this.#ctx = ctx;
        this.width = canvasHTMLElement.width;
        this.height = canvasHTMLElement.height;
        this.#canvasHTMLElement = canvasHTMLElement;
        // Grid ve kamera başlatılır
        this.grid = new Grid(Settings.default.gridCellSize,this.#canvasHTMLElement.height,this.#canvasHTMLElement.width);
        this.camera = new Camera(this.#canvasHTMLElement.width, this.#canvasHTMLElement.height);
        // Debugger ile ilişkilendirme (Canvas objesini kullan)
        ctx.font = "12px serif";
        ctx.fillStyle = "white";
    }

    /**
     * Tüm objeleri çizer ve debug vektörlerini gösterir
     * @param {number} timestamp - Çizim zamanı
     */
    drawObjects(timestamp){
        this.lastPaintTimestamp = timestamp;
        // Kamera player'ı takip etsin
        if (global && global.game && global.game.player) {
            this.camera.update(global.game.player.drawAttributes.location);
        }
        // Griddeki tüm entity'ler için çizim ve debug işlemleri
        this.grid.applyToAllEntities((entity) => {
            this.drawEntity(entity);

            // Her çizgi için debug noktası göster
            entity.drawAttributes.getActualShell().lines.forEach((line) => {
                Debugger.showPoint(line.startPoint);
            });
            // Kuvvet, ivme ve hız vektörlerini çiz
            Debugger.drawVector(
                entity.motionAttributes.force.copy().multiply(1e1),
                entity.drawAttributes.location,
                "red",
                2
            );
            Debugger.drawVector(
                entity.motionAttributes.acceleration.copy().multiply(1e1),
                entity.drawAttributes.location,
                "green",
                2
            );
            Debugger.drawVector(
                entity.motionAttributes.velocity.copy().multiply(1e1),
                entity.drawAttributes.location,
                "blue",
                2
            );
        });
    }

    /**
     * Canvas'ı temizler
     */
    clearCanvas(){
        this.#ctx.clearRect(0,0,this.#canvasHTMLElement.width,this.#canvasHTMLElement.height);
    }

    /**
     * Ekrana metin yazar
     * @param {string} text - Yazılacak metin
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     */
    writeText(text,x,y){
        this.#ctx.fillText(text,x,y);
    }

    /**
     * Bir entity'yi çizer
     * @param {Entity} entity - Çizilecek entity
     */
    drawEntity(entity){
        // Kamera offsetini uygula
        this.#drawPolygon(entity.drawAttributes.getActualShell(), this.camera);
    }

    /**
     * Çokgen veya çizgi dizisini çizer
     * @param {Polygon | Line[] | BreakableLine[]} polygon - Çizilecek şekil
     * @param {Camera} camera - Kamera
     */
    #drawPolygon(polygon, camera = null) {
        for (let i = 0; i < (polygon instanceof Polygon ? polygon.lines.length : polygon.length); i++) {
            ctx.beginPath();
            const currentLine = polygon instanceof Polygon ? polygon.lines[i] : polygon[i];

            let point1 = currentLine.startPoint;
            let point2 = currentLine.endPoint;

            // oyuncunun offsetini uygula
            point1 = camera.worldToScreen(point1.x, point1.y);
            point2 = camera.worldToScreen(point2.x, point2.y);

            ctx.lineWidth = currentLine.lineWidth;
            if(currentLine instanceof BreakableLine){
                const health = 50 + (currentLine.health / currentLine.maxHealth )  * 50;
                ctx.strokeStyle = `hsl(0 100% ${health}%)`;
            }else{
                ctx.strokeStyle = currentLine.lineColor;
            }

            ctx.moveTo(point1.x, point1.y); 
            ctx.lineTo(point2.x, point2.y); 
            ctx.stroke();
        }
    }
}