class Canvas{
    /** @type {HTMLCanvasElement} */
    canvasHTMLElement;
    /** @type {CanvasRenderingContext2D} */
    #ctx;
    /** @type {Entity[]} */
    objects = [];

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


    drawObjects(timestamp){
        this.lastPaintTimestamp = timestamp;

        this.objects.forEach( (object) => {
            object.draw(this.#ctx);
        })
    }

    clearCanvas(){
        this.#ctx.clearRect(0,0,this.canvasHTMLElement.width,this.canvasHTMLElement.height);
    }

    writeText(text,x,y){
        this.#ctx.fillText(text,x,y);
    }

}