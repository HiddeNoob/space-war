// Oyun ana kontrol sınıfı. Oyun döngüsünü, oyuncu ve canvas ilişkisini yönetir.
class Game{
    /** @type {Canvas} */
    canvasObject // Oyun ekranı ve çizim işlemleri

    /** @type {Player} */
    player // Oyuncu nesnesi

    screenWidth = 0; // Ekran genişliği
    screenHeight = 0; // Ekran yüksekliği
    
    isPaused = false; // Oyun duraklatıldı mı?

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
        
        Debugger.setup(this, ctx);
        // Oyun mantığı başlatılır
        this.gameLogic = new GameLogic(this.canvasObject.grid,this.canvasObject.camera,this.player);
        this.gameLogic.init();
    }

    /**
     * Oyun döngüsünü başlatır
     */
    run(){
        global.latestPaintTimestamp = Date.now() - global.pageInitTimestamp;
        const task = (timestamp) => {
            if(this.isPaused) return;
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

            
            this.canvasObject.showPlayerInformation(20,this.screenHeight - 130,this.player)

            const margin = 15;
            this.canvasObject.paintMiniMap(this.screenWidth - 200 - margin,this.screenHeight - 200 - margin,this.player);


            self.requestAnimationFrame(task);
        }
        self.requestAnimationFrame(task);
    }

    /**
     * Oyunu duraklatır
     */
    pause(){
        this.isPaused = true;
        SFXPlayer.sfxs["background"].pause();
    }

    /**
     * Oyunu devam ettirir
     */
    continue(){
        this.isPaused = false;
        SFXPlayer.sfxs["background"].play();
        this.run();
    }

    #debug(timestamp){
        Debugger.showFPS(timestamp, this.canvasObject.lastPaintTimestamp);
        Debugger.showGrid(this.canvasObject.grid);
    }


}