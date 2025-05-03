// Oyun mantığını ve handler yönetimini sağlayan ana sınıf
class GameLogic extends Handler{
    /** @type {Handler[]} */
    handlers = [] // Oyun içi handler listesi

    /**
     * GameLogic oluşturucu
     * @param {Grid} grid - Oyun grid'i
     * @param {Camera} camera - Kamera
     * @param {Player} player - Oyuncu
     */
    constructor(grid,camera,player){
        super(grid,player,camera)
        this.handlers.push(new CoinHandler(grid,player,camera));
        this.handlers.push(new CollisionHandler(grid,player,camera))
        this.handlers.push(new UserActionHandler(player,grid,camera))
        this.handlers.push(new EntityPhysicHandler(grid,player,camera))
        this.handlers.push(new EntityTerminater(grid,player,camera))
    }

    /**
     * Oyun döngüsünde tüm handler'ları günceller
     */
    update = () => {
        this.grid.applyToAllEntities((entity) => {
            entity.motionAttributes.resetInstantVectors();
            if (debug.showPoint) {
                const vector = entity.drawAttributes
                    .getActualShell()
                    .lines[0].normalVector(entity.drawAttributes.location);
                Debugger.drawVector(vector.multiply(20), entity.drawAttributes.location);
            }
        });
        let i = 1;
        this.handlers.forEach((handler) => {
            let a = Date.now();
            handler.update()
            let b = Date.now();
            if(debug.showHandlerLatency){
                ctx.fillText(`${handler.constructor.name}: ${(b-a).toFixed(2)} ms`,10,i * 20 + 20);
                i+= 1
            }
        });
    };

    /**
     * Tüm handler'ları başlatır
     */
    init = () => {
        this.handlers.forEach((handler) => {
            handler.init()
        });
    };
}