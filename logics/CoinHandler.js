class CoinHandler extends Handler{
    /**
     * @param {Grid} grid
     * @param {Player} player
     */
    constructor(grid,player){
        super(grid,player);
    }

    update = () => { 
        const entities = this.grid.getAllEntities();
        entities.forEach((entity) => entity instanceof Coin && this.#applyForceToCoin(entity))
        const coin = this.#isCollidingWithCoin(this.player);
        if(coin){
            this.player.money += coin.value; 
            coin.isAlive = false;
        }
    }

    /**
     * 
     * @param {Entity} player 
     * @returns {Coin | null}
     */
    #isCollidingWithCoin(player){
        const pos = player.drawAttributes.location;
        const entites = this.grid.getEntitiesNearby(pos.x,pos.y);
        for(let e of entites){
            if(e instanceof Coin && e.isCollidingWith(player)){
                console.log(e.isCollidingWith(player))
                return e;
            }
        }
        return null;
    }

    /** @param {Coin} coin */
    #applyForceToCoin(coin){
        const coinPos = coin.drawAttributes.location;
        const playerPos = this.player.drawAttributes.location;

        const relativePos = playerPos.copy().subtract(coinPos); // coin to player
        const multiplier = 1e-1 * (this.player.motionAttributes.mass * coin.motionAttributes.mass) /  relativePos.magnitude();
        coin.motionAttributes.force.add(relativePos.normalize().multiply(multiplier));


    }

} 