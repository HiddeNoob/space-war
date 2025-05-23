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

    #setDefaultStyle(){
        this.#ctx.globalAlpha = 1;
        this.#ctx.fillStyle = "white";
        this.#ctx.strokeStyle = "white";
        this.#ctx.lineWidth = 1;
        this.#ctx.font = "12px undertale-font";
    }
    
    /**
     * verilen entity'nin kırılabilir çizgilerinin kalan canını ve dayanıklılığını gösterir
     * @param {Entity} entity 
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     */
    showEntityInformation(entity,x,y){
        const lines = entity.drawAttributes.shell.lines;
        for(let i = 0; i < lines.length; i++){
            const line = lines[i];
            this.paintBar(x + i * 70, y + 10 , 50, 10, line.health / line.maxHealth);
        }
        this.#ctx.globalAlpha = 1;
        this.#ctx.fillStyle = "white";
        this.writeText(`HEALTH`, x + (lines.length / 3) * 70, y);
    }

    /**
     * @param {Player} player
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı 
     */
    showPlayerInformation(x, y, player) {
        this.#setDefaultStyle();
        this.showEntityInformation(player, x, y);
        const xpY = y + 50;

        this.writeText(`XP`, x, xpY); // score bar
        this.paintBar(x, xpY + 10, 200, 20, player.xp / player.xpToLevelUp);

        const scoreY = xpY + 50;
        this.writeText(`SCORE ${player.money}`, x, scoreY);

        // Silah ve mermi durumu
        this.showPlayerWeaponInfo(x, y - 100, player);
    }

    /**
     * Oyuncunun silah bilgisini ve durumunu gösterir
     * @param {Player} player
     * @param {number} x
     * @param {number} y
     */
    showPlayerWeaponInfo(x, y, player) {
        let weaponY = y;
        for (let i = 0; i < player.weapons.length; i++) {
            const weapon = player.weapons[i];
            const isCurrent = (i === player.currentWeaponIndex);

            // Silah adı
            this.#ctx.font = isCurrent ? "bold 18px undertale-font" : "16px undertale-font";
            this.#ctx.fillStyle = isCurrent ? "#FFD700" : "#AAA";
            this.writeText(`${isCurrent ? '▶ ' : ''}${weapon.weaponName}`, x, weaponY);

            // Mermi durumu
            this.#ctx.font = "14px undertale-font";
            this.#ctx.fillStyle = weapon.remainingBullet > 0 ? "#00FF00" : "#FF3333";

            const ammoX = x + 10 + weapon.weaponName.length * 15;
            
            // Yeniden doldurma durumu
            if (weapon.isReloading) {
                this.#ctx.font = "italic 14px undertale-font";
                this.#ctx.fillStyle = "#FF8800";
                this.writeText("Reloading...", ammoX, weaponY);
            }else if(isCurrent){
                this.writeText(`Ammo:`, ammoX, weaponY);
                this.writeText(`${weapon.remainingBullet} / ${weapon.maxBulletPerMagazine}`,ammoX + 60 , weaponY);
            }
            weaponY += 28;
        }
        this.#setDefaultStyle();
    }

    /**
     * Mini harita çizer
     * @param {Entity} trackedEntity - merkezdeki entity
     * @param {Number} mapWidth - mini harita boyutu 
     * @param {Number} mapHeight - mini harita boyutu 
     * @param {Number} x - Mini haritanın X koordinatı
     * @param {Number} y - Mini haritanın Y koordinatı
     */
    paintMiniMap(x,y,trackedEntity,mapHeight = 200,mapWidth = 200){
        const mapX = x;
        const mapY = y;
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
                selectedEntityShell.setColor("#ff845b");
            }

            this.#drawPolygon(selectedEntityShell);

        });
        // Mini harita çerçevesi
        this.#ctx.strokeStyle = '#fff';
        this.#ctx.lineWidth = 2;
        this.#ctx.strokeRect(mapX, mapY, mapWidth, mapHeight);
    }

    /**
     * Doldurabilen bir çubuk çizer
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} fillRate 
     */
    paintBar(x,y,width,height,fillRate,backgroundColor = "white",fillColor = "green",borderColor = {left: "white", right: "white",up: "white", bottom: "white"},borderThickness = 2,opacity = 0.5){
        this.#ctx.globalAlpha = 0.7;
        for (const direction of Object.keys(borderColor)) {
            const color = borderColor[direction];
            this.#ctx.strokeStyle = color;
            this.#ctx.lineWidth = 2;
            switch(direction) {
                case "left":
                    this.#ctx.strokeRect(x -  2 * borderThickness, y - borderThickness, borderThickness, height + borderThickness * 2);
                    break;
                case "right":
                    this.#ctx.strokeRect(x + width, y + borderThickness, borderThickness, height - borderThickness * 2);
                    break;
                case "up":
                    this.#ctx.strokeRect(x, y - borderThickness, width + borderThickness, borderThickness);
                    break;
                case "bottom":
                    this.#ctx.strokeRect(x, y + height, width + borderThickness, borderThickness);
                    break;
            }
        }
        this.#ctx.globalAlpha = opacity
        this.#ctx.fillStyle = backgroundColor;
        this.#ctx.fillRect(x - borderThickness / 2,y + borderThickness / 2,width,height - borderThickness / 2);
        this.#ctx.fillStyle = fillColor;
        this.#ctx.fillRect(x,y,width * fillRate,height);
        this.#setDefaultStyle();
    }
}