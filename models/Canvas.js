class Canvas{
    /** @type {HTMLCanvasElement} */
    #canvasHTMLElement;
    /** @type {CanvasRenderingContext2D} */
    #ctx;
    
    cellSize = 100;
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
        this.grid = new Grid(this.cellSize,this.#canvasHTMLElement.height,this.#canvasHTMLElement.width);
        ctx.font = "12px serif";
        ctx.fillStyle = "white";
    }

    /** @param {number} timestamp */
    drawObjects(timestamp){
        this.lastPaintTimestamp = timestamp;
        this.grid.cells.forEach( (setOfEntity) => {
            setOfEntity.forEach((entity) => this.drawEntity(entity));
        })
    }

    clearCanvas(){
        this.#ctx.clearRect(0,0,this.#canvasHTMLElement.width,this.#canvasHTMLElement.height);
    }

    writeText(text,x,y){
        this.#ctx.fillText(text,x,y);
    }

    showGrid(){
        this.#ctx.lineWidth = 1;
        this.#ctx.beginPath();
        for(let i = 0; i < this.#canvasHTMLElement.height / this.cellSize ; i++){
            for(let j = 0; j < this.#canvasHTMLElement.width / this.cellSize ; j++){
                const x = j * this.cellSize;
                const y = i * this.cellSize;
                const selectedEntities = this.grid.cells.get(this.grid.getCellKey(x,y));
                
                this.#ctx.moveTo(x,y);
                this.writeText(selectedEntities ? selectedEntities.size : "0",x + 5,y + 10)
                this.#ctx.lineTo(x + this.cellSize,y);
                this.#ctx.moveTo(x,y + this.cellSize);
                this.#ctx.lineTo(x,y);

            }
        }
        this.#ctx.stroke()
    }

    /** @param {Entity} entity */
    drawEntity(entity){
        ctx.translate(
            entity.drawAttributes.location.data[0],
            entity.drawAttributes.location.data[1]
        );
        ctx.rotate(entity.drawAttributes.angle);
        this.#drawPolygon(entity.drawAttributes.shell.breakableLines);
        ctx.rotate(-entity.drawAttributes.angle);
        ctx.translate(
            -entity.drawAttributes.location.data[0],
            -entity.drawAttributes.location.data[1]
        );
    }

    /** @param {Polygon | Line[]} polygon */
    #drawPolygon(polygon) {
        ctx.beginPath();
        for (let i = 0; i < (polygon instanceof Polygon ? polygon.lines.length : polygon.length); i++) {
            const currentLine = polygon instanceof Polygon ? polygon.lines[i] : polygon[i];

            let point1 = currentLine.startPoint;
            let point2 = currentLine.endPoint;

            ctx.lineWidth = currentLine.lineWidth;
            ctx.strokeStyle = currentLine.lineColor;

            ctx.moveTo(Math.floor(point1.data[0]), Math.floor(point1.data[1])); // Use data[0] and data[1]
            ctx.lineTo(Math.floor(point2.data[0]), Math.floor(point2.data[1])); // Use data[0] and data[1]
        }
        ctx.stroke();
    }
    
}