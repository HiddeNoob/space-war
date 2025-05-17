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
            if(Settings.default.debug.LinePoints){
                entity.drawAttributes.getActualShell().lines.forEach((line) => {
                    Debugger.showPoint(line.startPoint);
                });
            }

            // Kuvvet, ivme ve hız vektörlerini çiz
            if(Settings.default.debug.physicVectors){
                Debugger.drawVector(
                    entity.motionAttributes.force,
                    entity.drawAttributes.location,
                    "red",
                    2
                );
                Debugger.drawVector(
                    entity.motionAttributes.acceleration,
                    entity.drawAttributes.location,
                    "green",
                    2
                );
                Debugger.drawVector(
                    entity.motionAttributes.velocity.copy().multiply(10),
                    entity.drawAttributes.location,
                    "blue",
                    2
                );
            }

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

        // Entity'nin canına göre renk değişimi
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
            this.#ctx.beginPath();
            const currentLine = polygon.lines[i];
            let point1 = currentLine.startPoint;
            let point2 = currentLine.endPoint;
            this.#ctx.strokeStyle = currentLine.lineColor;
            this.#ctx.lineWidth = currentLine.lineWidth;
            this.#ctx.moveTo(point1.x, point1.y); 
            this.#ctx.lineTo(point2.x, point2.y); 
            this.#ctx.stroke();
            this.#ctx.closePath();
        }
    }
    
    /**
     * verilen entity'nin kırılabilir çizgilerinin kalan canını ve dayanıklılığını gösterir
     * @param {Entity} entity 
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
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

    /**
     * Mini harita çizer
     * @param {Entity} trackedEntity - merkezdeki entity
     * @param {Number} mapWidth - mini harita boyutu 
     * @param {Number} mapHeight - mini harita boyutu 
     * @returns 
     */
    paintGameMap(trackedEntity,mapHeight = 200,mapWidth = 200){
        const margin = 20;
        const mapX = this.width - mapWidth - margin;
        const mapY = margin;
        const trackedEntityPos = trackedEntity.drawAttributes.location;

        let screenMapRatio = { // 1:10 ölçek
            x: 0.1,
            y: 0.1,
            shellScale : 0.1
        };

        this.#ctx.globalAlpha = 0.7;
        this.#ctx.fillStyle = '#222';
        this.#ctx.fillRect(mapX, mapY, mapWidth, mapHeight);

        this.#ctx.globalAlpha = 1.0;


        this.grid.applyToAllEntities(selectedEntity => {
            const selectedEntityShell = selectedEntity.drawAttributes.shell.copy();
            selectedEntityShell.rotate(selectedEntity.drawAttributes.angle);
            selectedEntityShell.scaleBy(screenMapRatio.shellScale);
            const selectedEntityPos = selectedEntity.drawAttributes.location;

            const dx = selectedEntityPos.x - trackedEntityPos.x;
            const dy = selectedEntityPos.y - trackedEntityPos.y;
            const px = mapX + mapWidth/2 + dx * screenMapRatio.x;
            const py = mapY + mapHeight/2 + dy * screenMapRatio.y;

            if(px < mapX || px > mapX + mapWidth || py < mapY || py > mapY + mapHeight) return;
            
            
            selectedEntityShell.move(new Vector(px, py));


            if(selectedEntity instanceof Attacker && selectedEntity != trackedEntity){
                selectedEntityShell.setColor("red");
            }else if(selectedEntity instanceof AttackerSpawner){
                selectedEntityShell.setColor("purple");
            }

            this.#drawPolygon(selectedEntityShell);

        });
        // Mini harita çerçevesi
        this.#ctx.strokeStyle = '#fff';
        this.#ctx.lineWidth = 2;
        this.#ctx.strokeRect(mapX, mapY, mapWidth, mapHeight);
    }
}