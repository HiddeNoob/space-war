class Canvas{
    /** @type {HTMLCanvasElement} */
    canvasHTMLElement;
    /** @type {CanvasRenderingContext2D} */
    #ctx;
    /** @type {Grid} */
    grid = new Grid(50); // 50px partition

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
    
}