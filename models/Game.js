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
        this.player = new Player();
        console.log(this.player)
        this.gameLogic = new GameLogic(this.canvasObject.grid,this.player);
        this.canvasObject.grid.addEntity(this.player);
        const motion1 = new MotionAttributes(100,100);
        motion1.speed = new Vector(0,0);
        const motion2 = new MotionAttributes(100,100);
        motion2.speed = new Vector(0,0);
        this.canvasObject.grid.addEntity(new Entity(new DrawAttributes(GlobalShapes.TRIANGLE,new Vector(150,150),30),motion1));
        this.canvasObject.grid.addEntity(new Entity(new DrawAttributes(GlobalShapes.TRIANGLE,new Vector(500,150),160),motion2));
    }

    run(){  
        const task = (timestamp) => {
            this.canvasObject.clearCanvas();
            this.settings.showFPS && this.showFPS(timestamp);
            this.gameLogic.update();
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