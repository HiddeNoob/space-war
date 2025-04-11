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

    /** 
     * @param {(entity1: Entity, entity2: Entity) => void} callback 
     * @description aynı hücredeki elemanlara callback atar
    */
    applyToEntityPairs(callback){
                /** @type {Map<any,Set>} */
                const processedEntites = new Map();
                const addRelate = (entity1,entity2) => {
                    if(!processedEntites.get(entity1))
                        processedEntites.set(entity1,new Set());
                    
                    processedEntites.get(entity1).add(entity2)
                    
                    if(!processedEntites.get(entity2))
                        processedEntites.set(entity2,new Set());

                    processedEntites.get(entity2).add(entity1)
                    
                } 
                this.grid.cells.forEach((entities) => {
                    entities.forEach((entity1) => {
                        const nearbyEntities = this.grid.getEntitiesNearby(entity1.drawAttributes.location.x, entity1.drawAttributes.location.y);
                        nearbyEntities.forEach((entity2) => {
                            if(entity1 !== entity2){

                                if(processedEntites.get(entity1) && processedEntites.get(entity1).has(entity2)) // onceden islenmis gec
                                    return;

                                callback(entity1,entity2);

                                addRelate(entity1,entity2) // aynı elemanlar tekrar işlenmesin diye mappera ekliyorum
                            }
                        });
                    });
                });
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
        ctx.beginPath();
        ctx.arc(vector.x,vector.y,1,0,2 * Math.PI);
        ctx.stroke();
    }
}