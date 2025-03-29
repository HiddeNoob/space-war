class Canvas{

    /** @type {CanvasRenderingContext2D} */
    canvasElement;
    /** @type {DrawableBase[]} */
    objects = [];

    /**
     * @param {CanvasRenderingContext2D} canvas
     */
    constructor(canvas){
        this.canvasElement = canvas;
    }

    async startPaintingAsync(){
        while(true){
            await new Promise(resolve => setTimeout(resolve, 10));
            this.canvasElement.clearRect(0, 0, this.canvasElement.canvas.width, this.canvasElement.canvas.height);
            this.drawObjects();
        }
    }

    drawObjects(){
        ctx.lineWidth = 14;
        ctx.strokeStyle = "green";
        this.objects.forEach((item) => {
            for(let i = 0; i < item.path.length - 1 ; i++){
                let selectedPoint = item.path[i];
                let nextPoint = item.path[i + 1];
                this.canvasElement.moveTo(selectedPoint.x,selectedPoint.y);
                this.canvasElement.lineTo(nextPoint.x,nextPoint.y);
                this.canvasElement.stroke();
            }
        })
    }

    #drawPolygon(){

    }
}