class Handler{
    /** @type {CallableFunction} */
    update;

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
        if (!debug) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = kalinlik;
        ctx.beginPath();
        ctx.moveTo(startVector.x,startVector.y)
        ctx.lineTo(vector.x + startVector.x,vector.y + startVector.y);
        ctx.stroke();
    }
    
    /** @param {Vector} vector */
    static showPoint(vector){
        if (!debug) return;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(vector.x,vector.y,1,0,2 * Math.PI);
        ctx.stroke();
    }
}