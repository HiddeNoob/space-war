class GameLogic{
    /** @type {Grid} */
    #grid;
    /** @type {Player} */
    #player;
    
    /** @type {EntityPhysic} */
    #entityPhysic;

    /** @type {EntityTerminater} */
    #entityTerminater;

    /** @type {CollisionDetector} */
    #collisionDetector;

    /** @type {UserActionHandler} */
    #userActionHandler;

    /**
     * 
     * @param {Grid} grid 
     * @param {Player} player 
     */
    constructor(grid,player){
        this.#grid = grid;
        this.#player = player;
        this.#entityPhysic = new EntityPhysic(grid);
        this.#entityTerminater = new EntityTerminater(grid);
        this.#collisionDetector = new CollisionDetector(grid);
        this.#userActionHandler = new UserActionHandler(player,grid);
    }

    update(){
        this.#collisionDetector.makeCollisions();
        this.#userActionHandler.update();
        this.#entityPhysic.update();
        this.#entityTerminater.processDeadEntites()
    }
}