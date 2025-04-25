class Canvas{
    /** @type {HTMLCanvasElement} */
    #canvasHTMLElement;
    /** @type {CanvasRenderingContext2D} */
    #ctx;
    
    /** @type {Grid} */
    grid

    /** @type {number} */
    lastPaintTimestamp;
    
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvasHTMLElement
     */
    constructor(ctx,canvasHTMLElement){
        this.#ctx = ctx;
        this.#canvasHTMLElement = canvasHTMLElement;
        this.grid = new Grid(Settings.default.gridCellSize,this.#canvasHTMLElement.height,this.#canvasHTMLElement.width);
        ctx.font = "12px serif";
        ctx.fillStyle = "white";
    }

    /** @param {number} timestamp */
    drawObjects(timestamp){
        this.lastPaintTimestamp = timestamp;
        this.grid.applyToAllEntities((entity) => {
            this.drawEntity(entity);

            if (debug) {
                this.drawVector(
                    entity.motionAttributes.force.copy().multiply(1e1),
                    entity.drawAttributes.location,
                    "red",
                    2
                );
                this.drawVector(
                    entity.motionAttributes.acceleration.copy().multiply(1e1),
                    entity.drawAttributes.location,
                    "green",
                    2
                );
                this.drawVector(
                    entity.motionAttributes.velocity.copy().multiply(1e1),
                    entity.drawAttributes.location,
                    "blue",
                    2
                );
            }
        });
    }

    clearCanvas(){
        this.#ctx.clearRect(0,0,this.#canvasHTMLElement.width,this.#canvasHTMLElement.height);
    }

    writeText(text,x,y){
        this.#ctx.fillText(text,x,y);
    }

    showGrid(){
        const cellSize = this.grid.cellSize
        this.#ctx.lineWidth = 1;
        this.#ctx.strokeStyle= "white";
        this.#ctx.beginPath();
        for(let i = 0; i < this.#canvasHTMLElement.height / cellSize ; i++){
            for(let j = 0; j < this.#canvasHTMLElement.width / cellSize ; j++){
                const x = j * cellSize;
                const y = i * cellSize;
                let totalEntities = 0;
                const selectedEntities = this.grid.cells.get(this.grid.getCellKey(x, y));
                selectedEntities?.forEach((set) => totalEntities += set.size);
                
                this.#ctx.moveTo(x,y);
                this.writeText(totalEntities,x + 5,y + 10)
                this.#ctx.lineTo(x + cellSize,y);
                this.#ctx.moveTo(x,y + cellSize);
                this.#ctx.lineTo(x,y);

            }
        }
        this.#ctx.stroke()
    }

    /** @param {Entity} entity */
    drawEntity(entity){

        this.#drawPolygon(entity.drawAttributes.getActualShell());
    }

    /** @param {Polygon | Line[] | BreakableLine[]} polygon */
    #drawPolygon(polygon) {
        for (let i = 0; i < (polygon instanceof Polygon ? polygon.lines.length : polygon.length); i++) {
            ctx.beginPath();
            const currentLine = polygon instanceof Polygon ? polygon.lines[i] : polygon[i];

            let point1 = currentLine.startPoint;
            let point2 = currentLine.endPoint;

            ctx.lineWidth = currentLine.lineWidth;
            if(currentLine instanceof BreakableLine){
                const health = 50 + (currentLine.health / currentLine.maxHealth )  * 50;
                ctx.strokeStyle = `hsl(0 100% ${health}%)`;
            }else{
                ctx.strokeStyle = currentLine.lineColor;
            }


            ctx.lineTo(point1.x, point1.y); 
            ctx.lineTo(point2.x, point2.y); 
            ctx.stroke();
        }
    }

    /** @param {Vector} vector */
    drawVector(vector,startVector = new Vector(0,0),color = "white",kalinlik = 4){
        if (!debug) return;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = kalinlik;
        ctx.beginPath();
        ctx.moveTo(startVector.x,startVector.y)
        ctx.lineTo(vector.x + startVector.x,vector.y + startVector.y);
        ctx.stroke();
    }
    
    /** @param {Vector} vector */
    showPoint(vector){
        if (!debug) return;
        ctx.beginPath();
        ctx.arc(vector.x,vector.y,1,0,2 * Math.PI);
        ctx.stroke();
    }
    
}