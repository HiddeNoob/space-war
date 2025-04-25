class Game{
    /** @type {Canvas} */
    canvasObject

    /** @type {Player} */
    player
    
    #isPaused = false;


    constructor(canvasObject,player){
        this.canvasObject = canvasObject;



        this.player = player
        

        for(let i = 0; i < 50; i++){
            this.canvasObject.grid.addEntity(Coin.create(Math.random() * 500 + 300,Math.random() * 500 + 300,20));
        }


        this.canvasObject.grid.addEntity(
        new Entity(
            new DrawAttributes(ShapeFactory.createRegularPolygon(5,20), new Vector(420, 300),Math.PI / 2),
        )
        );
        this.canvasObject.grid.addEntity(
        new Entity(
            new DrawAttributes(GlobalShapes.RECTANGLE, new Vector(220, 180)),
        )
        );


        this.gameLogic = new GameLogic(this.canvasObject.grid,this.player);
        this.canvasObject.grid.addEntity(this.player);
    }

    run(){
        globalGameVariables.latestPaintTimestamp = Date.now() - globalGameVariables.latestPaintTimestamp;
        const task = (timestamp) => {
            if(this.#isPaused) return;
            globalGameVariables.previousLatestPaintTimestamp = globalGameVariables.latestPaintTimestamp;
            globalGameVariables.latestPaintTimestamp = timestamp;
            this.canvasObject.clearCanvas();
            this.canvasObject.writeText(`${(globalGameVariables.latestPaintTimestamp - globalGameVariables.previousLatestPaintTimestamp).toFixed(2)} frame`,80,20);
            Settings.default.showFPS && this.showFPS(timestamp);
            this.canvasObject.grid.refreshGrid();
            this.gameLogic.update();
            Settings.default.debug && this.canvasObject.showGrid();
            this.canvasObject.drawObjects(timestamp);
            self.requestAnimationFrame(task);
        }
        self.requestAnimationFrame(task);
    }

    pause(){
        this.#isPaused = true;
    }

    continue(){
        this.#isPaused = false;
        this.run();
    }

    showFPS(timestamp){
        this.canvasObject.writeText((`${(1000 / (timestamp - this.canvasObject.lastPaintTimestamp)).toFixed(2)} FPS`),10,20);
    }
}