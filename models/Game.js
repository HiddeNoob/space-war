class Game{
    /** @type {Canvas} */
    canvasObject
    /** @type {Player} */
    player
    
    /** @type {PlayerLocationUpdater} */
    playerLocationUpdater

    settings = {
        "showFPS" : true
    }

    constructor(canvasObject){
        this.canvasObject = canvasObject;
        this.player = new Player();
        this.playerLocationUpdater = new PlayerLocationUpdater(this.player);
        console.log(this.player);
    }

    run(){
        const task = (timestamp) => {
            this.canvasObject.clearCanvas();
            this.settings.showFPS && this.showFPS(timestamp);
            this.playerLocationUpdater.update();
            this.canvasObject.drawObjects(timestamp);
            self.requestAnimationFrame(task);
        }
        self.requestAnimationFrame(task);
    }

    showFPS(timestamp){
        this.canvasObject.writeText((`${(1000 / (timestamp - this.canvasObject.lastPaintTimestamp)).toFixed(2)} FPS`),10,20);
    }
}