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
     * @param {Camera} camera - Oyun kamerası
     */
    constructor(ctx,canvasHTMLElement,camera){
        this.#ctx = ctx;
        this.width = canvasHTMLElement.width;
        this.height = canvasHTMLElement.height;
        this.#canvasHTMLElement = canvasHTMLElement;
        // Grid ve kamera başlatılır
        this.grid = new Grid(Settings.default.gridCellSize,this.#canvasHTMLElement.height,this.#canvasHTMLElement.width);
        this.camera = camera;
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
        this.camera.updateOffset(this.lastPaintTimestamp - global.previousLatestPaintTimestamp);
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
        const shell = entity.drawAttributes.getActualShell();

        shell.lines.forEach((line) => {
            line.startPoint = this.camera.worldToScreen(line.startPoint.x, line.startPoint.y);
            line.endPoint = this.camera.worldToScreen(line.endPoint.x, line.endPoint.y);
            if(entity.canCollide){
                const health = 50 + (line.health / line.maxHealth )  * 50; 
                // 50 ise kırmızı 100 ise beyaz
                line.lineColor = `hsl(0 100% ${health}%)`;
            }
        })

        this.#drawPolygon(shell);
    }

    /**
     * Çokgen veya çizgi dizisini çizer
     * @param {Polygon} polygon - Çizilecek şekil
     */
    #drawPolygon(polygon) {
        for (let i = 0; i < polygon.lines.length; i++) {
            const currentLine = polygon.lines[i];
            let point1 = currentLine.startPoint;
            let point2 = currentLine.endPoint;
            this.#ctx.strokeStyle = currentLine.lineColor;
            this.#ctx.lineWidth = currentLine.lineWidth;
            this.#ctx.beginPath();
            this.#ctx.moveTo(point1.x, point1.y); 
            this.#ctx.lineTo(point2.x, point2.y); 
            this.#ctx.stroke();
        }
    }
    
    /**
     * verilen entity'nin kırılabilir çizgilerinin kalan canını ve dayanıklılığını gösterir
     * @param {Entity} entity 
     */
    showEntityInformation(entity,x,y){
        this.writeText("durability, health", x, y);
        for(let i = 0; i < entity.drawAttributes.shell.lines.length; i++){
            const line = entity.drawAttributes.shell.lines[i];
            this.writeText(`${line.durability.toFixed(2)} ${line.health.toFixed(2)}`, x, y + (i+1) * 20);
        }
    }

    /**
     * @param {Player} player 
     */
    showPlayerInformation(player){
        this.showEntityInformation(player,40,this.height - 100);
        this.writeText(`money ${player.money}`, 40, this.height - 120);
        
    }
}