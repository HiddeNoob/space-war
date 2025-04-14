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


        // TODO bu moment of inertiayi direk obje oluşturulurken hesaplanmalı
        const globalMoment = 5e1;
        const globalMass = 1e-1;
        const globalScale = 1;

        const playerScale = globalScale*1
        const playerMass = globalMass * 8
        const playerMoment = globalMoment * 2;
        const playerMotion = new MotionAttributes(1, 10, playerMass, playerMoment);
        
        const bulletScale = globalScale*1
        const bulletMass = (globalMass / 10) * bulletScale**2
        const bulletMoment = globalMoment * bulletScale**2;
        const bulletMotion = new MotionAttributes((Math.PI / 180) / 2, 10,bulletMass ,bulletMoment);

        const blockScale = globalScale*5
        const blockMass = globalMass * blockScale**2;
        const blockMoment = 2 * globalMoment * blockScale**2;
        const blockMotion = new MotionAttributes(0.05, 20,blockMass ,blockMoment );

        this.player = new Player(0,1,5,globalMass / 10,globalMoment / 10,new DrawAttributes(GlobalShapes.TRIANGLE.copy().scaleBy(playerScale)),playerMotion);
        this.player.weapon = new Weapon("deagle",bulletMass,10,10,new Bullet(5,new DrawAttributes(GlobalShapes.RECTANGLE.copy().scaleBy(bulletScale)),bulletMotion))
        
        this.player.drawAttributes.location = new Vector(100,100)


        const coinMotion = new MotionAttributes(10,5,globalMass * 1e2,globalMoment * 1e2);
        this.canvasObject.grid.addEntity(new Coin(new DrawAttributes(GlobalShapes.RECTANGLE.copy().scaleBy(2),new Vector(500,500)),coinMotion));


        this.canvasObject.grid.addEntity(
        new Entity(
            new DrawAttributes(GlobalShapes.createRegularPolygon(10,20), new Vector(420, 300),Math.PI / 2),
            blockMotion.copy()
        )
        );
        this.canvasObject.grid.addEntity(
        new Entity(
            new DrawAttributes(GlobalShapes.RECTANGLE.copy().scaleBy(blockScale), new Vector(220, 180)),
            blockMotion
        )
        );


        console.log(this.player)
        this.gameLogic = new GameLogic(this.canvasObject.grid,this.player);
        this.canvasObject.grid.addEntity(this.player);
    }

    run(){
        let timestampLast = 0;
        const task = (timestamp) => {
            this.canvasObject.clearCanvas();
            this.canvasObject.writeText(`${(timestamp - timestampLast).toFixed(2)} frame`,80,20);
            this.settings.showFPS && this.showFPS(timestamp);
            this.canvasObject.grid.refreshGrid();

            let a = Date.now();
            this.gameLogic.update();
            let b = Date.now();
            this.canvasObject.writeText(`${(b - a).toFixed(2)} gameLogic ms`,150,20);
            
            this.canvasObject.showGrid();
            this.canvasObject.drawObjects(timestamp);
            timestampLast = timestamp;
            self.requestAnimationFrame(task);
        }
        self.requestAnimationFrame(task);
    }

    showFPS(timestamp){
        this.canvasObject.writeText((`${(1000 / (timestamp - this.canvasObject.lastPaintTimestamp)).toFixed(2)} FPS`),10,20);
    }
}