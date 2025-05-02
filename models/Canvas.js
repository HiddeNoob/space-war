class Canvas{
    /** @type {HTMLCanvasElement} */
    #canvasHTMLElement;
    /** @type {CanvasRenderingContext2D} */
    #ctx;
    
    /** @type {Grid} */
    grid

    width = 0;
    height = 0;

    /** @type {number} */
    lastPaintTimestamp;

    /** @type {Camera} */
    camera;
    
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvasHTMLElement
     */
    constructor(ctx,canvasHTMLElement){
        this.#ctx = ctx;
        this.width = canvasHTMLElement.width;
        this.height = canvasHTMLElement.height;
        this.#canvasHTMLElement = canvasHTMLElement;
        this.grid = new Grid(Settings.default.gridCellSize,this.#canvasHTMLElement.height,this.#canvasHTMLElement.width);
        this.camera = new Camera(this.#canvasHTMLElement.width, this.#canvasHTMLElement.height);
        Debugger.setup(ctx, this.camera, Settings.default.debug);
        ctx.font = "12px serif";
        ctx.fillStyle = "white";
    }

    /** @param {number} timestamp */
    drawObjects(timestamp){
        this.lastPaintTimestamp = timestamp;
        // Kamera player'ı takip etsin
        if (global && global.game && global.game.player) {
            this.camera.update(global.game.player.drawAttributes.location);
        }
        this.grid.applyToAllEntities((entity) => {
            this.drawEntity(entity);

            entity.drawAttributes.getActualShell().lines.forEach((line) => {
                Debugger.showPoint(line.startPoint);
            });
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

    clearCanvas(){
        this.#ctx.clearRect(0,0,this.#canvasHTMLElement.width,this.#canvasHTMLElement.height);
    }

    writeText(text,x,y){
        this.#ctx.fillText(text,x,y);
    }


    /** @param {Entity} entity */
    drawEntity(entity){
        // Kamera offsetini uygula
        this.#drawPolygon(entity.drawAttributes.getActualShell(), this.camera);
    }

    /** @param {Polygon | Line[] | BreakableLine[]} polygon */
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