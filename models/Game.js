class Game{
    /** @type {Canvas} */
    canvasObject

    /** @type {Player} */
    player
    
    /** @type {UserActionHandler} */
    userActionHandler

    /** @type {EntityLocationUpdater} */
    entityLocationUpdater

    settings = {
        "showFPS" : true
    }

    constructor(canvasObject){
        this.canvasObject = canvasObject;
        this.player = new Player();
        console.log(this.player)
        this.canvasObject.grid.addEntity(this.player);
        this.userActionHandler = new UserActionHandler(this.player,this.canvasObject);
        this.entityLocationUpdater = new EntityLocationUpdater(this.canvasObject);
    }

    run(){  
        const task = (timestamp) => {
            this.canvasObject.clearCanvas();
            this.settings.showFPS && this.showFPS(timestamp);
            this.userActionHandler.update();
            this.entityLocationUpdater.update();
            this.canvasObject.grid.refreshGrid();
            this.canvasObject.showGrid();
            this.canvasObject.drawObjects(timestamp);
            self.requestAnimationFrame(task);
        }
        self.requestAnimationFrame(task);
    }

    showFPS(timestamp){
        this.canvasObject.writeText((`${(1000 / (timestamp - this.canvasObject.lastPaintTimestamp)).toFixed(2)} FPS`),10,20);
    }
}