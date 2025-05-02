class GameLogic extends Handler{
    
    /** @type {Handler[]} */
    handlers = []

    /**
     * @param {Grid} grid 
     * @param {Player} player 
     */
    constructor(grid,player){
        super(grid,player)
        this.handlers.push(new CoinHandler(grid,player));
        this.handlers.push(new CollisionHandler(grid,player))
        this.handlers.push(new UserActionHandler(player,grid))
        this.handlers.push(new EntityPhysicHandler(grid,player))
        this.handlers.push(new EntityTerminater(grid,player))
    }

    update = () => {
        this.grid.applyToAllEntities((entity) => {
            entity.motionAttributes.resetInstantVectors();
            if (debug.showPoint) {
                const vector = entity.drawAttributes
                    .getActualShell()
                    .lines[0].normalVector(entity.drawAttributes.location);
                Handler.drawVector(vector.multiply(20), entity.drawAttributes.location);
            }
        });

        let i = 1;
        this.handlers.forEach((handler) => {
            let a = Date.now();
            handler.update()
            let b = Date.now();
            if(debug.showHandlerLatency){
                ctx.fillText(`${handler.constructor.name}: ${(b-a).toFixed(2)} ms`,10,i * 30 + 20);
                i+= 1
            }
        });


    };

    init = () => {
        this.handlers.forEach((handler) => {
            handler.init()
        });
    };
}