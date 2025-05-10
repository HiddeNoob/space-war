// Oyun ana kontrol sınıfı. Oyun döngüsünü, oyuncu ve canvas ilişkisini yönetir.
class Game{
    /** @type {Canvas} */
    canvasObject // Oyun ekranı ve çizim işlemleri

    /** @type {Player} */
    player // Oyuncu nesnesi

    screenWidth = 0; // Ekran genişliği
    screenHeight = 0; // Ekran yüksekliği
    
    #isPaused = false; // Oyun duraklatıldı mı?

    /**
     * Game nesnesi oluşturur
     * @param {Canvas} canvasObject - Oyun ekranı
     * @param {Player} player - Oyuncu
     */
    constructor(canvasObject,player){
        this.canvasObject = canvasObject;
        this.screenWidth = canvasObject.width;
        this.screenHeight = canvasObject.height;
        this.player = player;
        this.canvasObject.grid.addEntity(this.player);

        // Başlangıçta bazı entity'ler ekleniyor
        this.canvasObject.grid.addEntity(new Entity(
            new DrawAttributes(ShapeFactory.createRectangle(200,50), new Vector(100, 100), Math.PI / 2),
        ));
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
        Debugger.setup(this, ctx);
        // Oyun mantığı başlatılır
        this.gameLogic = new GameLogic(this.canvasObject.grid,this.canvasObject.camera,this.player);

    }

    /**
     * Oyun döngüsünü başlatır
     */
    run(){
        global.latestPaintTimestamp = Date.now() - global.latestPaintTimestamp;
        this.gameLogic.init();
        const task = (timestamp) => {
            if(this.#isPaused) return;
            global.previousLatestPaintTimestamp = global.latestPaintTimestamp;
            global.latestPaintTimestamp = timestamp;
            const deltaTime = (timestamp - global.previousLatestPaintTimestamp)

            this.canvasObject.clearCanvas();

            // zamanlanmış olay varsa çalıştırılır
            Timer.update(deltaTime) 

            // Entitylerin yeni lokasyonlarına göre tekrardan grid hesaplanır 
            this.canvasObject.grid.refreshGrid(this.player.drawAttributes.location);
            
            // Game logic uygulanır
            this.gameLogic.update();


            // Debuglar
            this.#debug(timestamp);

            // Tüm objeler çizilir
            this.canvasObject.drawObjects(timestamp);


            self.requestAnimationFrame(task);
        }
        self.requestAnimationFrame(task);
    }

    /**
     * Oyunu duraklatır
     */
    pause(){
        this.#isPaused = true;
    }

    /**
     * Oyunu devam ettirir
     */
    continue(){
        this.#isPaused = false;
        this.run();
    }

    #debug(timestamp){
        if(Settings.default.debug.showFPS.showLatency) {
            Debugger.writeText(`${(global.latestPaintTimestamp - global.previousLatestPaintTimestamp).toFixed(2)} ms`, 100, 20);
        }
        if (Settings.default.debug.showFPS) {
            Debugger.showFPS(timestamp, this.canvasObject.lastPaintTimestamp);
            
        }
        if (Settings.default.debug.grid.show) {
            Debugger.showGrid(this.canvasObject.grid);
        }
    }


}