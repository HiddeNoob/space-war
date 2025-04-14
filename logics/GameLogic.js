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
        this.grid.getAllEntities().forEach((e) => {
            e.motionAttributes.resetInstantVectors()
            if(debug){
                let vector = e.drawAttributes.getActualShell().lines[0].normalVector(e.drawAttributes.location);
                Handler.drawVector(vector.multiply(20),e.drawAttributes.location);
            }
        });
        this.handlers.forEach((handler) => handler.update())

    };
}