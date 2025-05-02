class Game{
    /** @type {Canvas} */
    canvasObject

    /** @type {Player} */
    player

    screenWidth = 0;
    screenHeight = 0;
    
    #isPaused = false;


    /**
     * 
     * @param {Canvas} canvasObject 
     * @param {Player} player 
     */
    constructor(canvasObject,player){
        this.canvasObject = canvasObject;

        this.screenWidth = canvasObject.width;
        this.screenHeight = canvasObject.height;


        this.player = player
        
        this.canvasObject.grid.addEntity(new Entity(
            new DrawAttributes(ShapeFactory.createRectangle(200,50), new Vector(100, 100), Math.PI / 2),
        ));

        // for(let i = 0; i < 50; i++){
        //     this.canvasObject.grid.addEntity(Coin.create(Math.random() * 500 + 300,Math.random() * 500 + 300,20));
        // }


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
        global.latestPaintTimestamp = Date.now() - global.latestPaintTimestamp;
        this.gameLogic.init();
        const task = (timestamp) => {
            if(this.#isPaused) return;
            global.previousLatestPaintTimestamp = global.latestPaintTimestamp;
            global.latestPaintTimestamp = timestamp;

            this.canvasObject.clearCanvas();
            this.canvasObject.writeText(`${(global.latestPaintTimestamp - global.previousLatestPaintTimestamp).toFixed(2)} frame`,80,20);
            if (Settings.default.debug.showFPS) {
                Debugger.showFPS(timestamp, this.canvasObject.lastPaintTimestamp);
            }
            this.canvasObject.grid.refreshGrid();
            this.gameLogic.update();
            if (Settings.default.debug.showGrid) {
                Debugger.showGrid(this.canvasObject.grid, this.canvasObject.camera);
            }
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