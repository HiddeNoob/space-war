class Game{
    /** @type {Canvas} */
    canvasObject
    /** @type {Player} */
    player

    settings = {
        "showFPS" : true
    }

    constructor(canvasObject){
        this.canvasObject = canvasObject;
    }

    run(){
        const task = (timestamp) => {
            this.canvasObject.clearCanvas();
            this.showFPS(timestamp);
            this.canvasObject.drawObjects(timestamp);
            window.requestAnimationFrame(task); 
        }
        window.requestAnimationFrame(task);
    }

    showFPS(timestamp){
        this.canvasObject.writeText((`${(1000 / (timestamp - this.canvasObject.lastPaintTimestamp)).toFixed(2)} FPS`),10,20);
    }
}