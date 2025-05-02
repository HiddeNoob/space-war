class Handler{
    /** @type {CallableFunction} */
    update = () => {};

    /** @type {CallableFunction} */
    init = () => {};

    /** @type {Grid} */
    grid

    /** @type {Player} */
    player

    /**
     *  @param {Grid} grid 
     *  @param {Player} player 
    */
    constructor(grid,player){
        this.grid = grid;
        this.player = player;
    }


    /** @param {Vector} vector */
    static drawVector(vector,startVector = new Vector(0,0),color = "white",kalinlik = 1){
        Debugger.drawVector(vector, startVector, color, kalinlik);
    }
    
    /** @param {Vector} vector */
    static showPoint(vector){
        Debugger.showPoint(vector);
    }
}