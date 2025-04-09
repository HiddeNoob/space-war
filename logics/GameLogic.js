class GameLogic extends Handler{
    
    /** @type {Handler[]} */
    handlers = []

    /**
     * @param {Grid} grid 
     * @param {Player} player 
     */
    constructor(grid,player){
        super(grid,player)
        this.handlers.push(new EntityPhysicHandler(grid,player))
        this.handlers.push(new EntityTerminater(grid,player))
        this.handlers.push(new CollisionHandler(grid,player))
        this.handlers.push(new UserActionHandler(player,grid))
    }

    update = () => this.handlers.forEach((handler) => handler.update());
}