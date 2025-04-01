class Canvas{
    /** @type {HTMLCanvasElement} */
    canvasHTMLElement;
    /** @type {CanvasRenderingContext2D} */
    #ctx;
    
    cellSize = 100;
    /** @type {Grid} */
    grid = new Grid(this.cellSize); // 50px partition

    /** @type {number} */
    lastPaintTimestamp;
    
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvasHTMLElement
     */
    constructor(ctx,canvasHTMLElement){
        this.#ctx = ctx;
        this.canvasHTMLElement = canvasHTMLElement;
        ctx.font = "12px serif";
        ctx.fillStyle = "white";
    }

    /** @param {number} timestamp */
    drawObjects(timestamp){
        this.lastPaintTimestamp = timestamp;
        this.grid.cells.forEach( (setOfEntity) => {
            setOfEntity.forEach((entity) => entity.draw(this.#ctx));
        })
    }

    clearCanvas(){
        this.#ctx.clearRect(0,0,this.canvasHTMLElement.width,this.canvasHTMLElement.height);
    }

    writeText(text,x,y){
        this.#ctx.fillText(text,x,y);
    }

    showGrid(){
        this.#ctx.lineWidth = 1;
        this.#ctx.beginPath();
        for(let i = 0; i < this.canvasHTMLElement.height / this.cellSize ; i++){
            for(let j = 0; j < this.canvasHTMLElement.width / this.cellSize ; j++){
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
    
}