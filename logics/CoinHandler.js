class CoinHandler extends Handler{
    /**
     * @param {Grid} grid
     * @param {Player} player
     */
    constructor(grid,player){
        super(grid,player);
    }

    update = () => {
        let a = Date.now();
        this.grid.applyToCertainEntities(Coin.name,(entity) => {
            this.#applyForceToCoin(/** @type {Coin} */ (entity));
        });
        let b = Date.now();
        this.#catchCoin();
        let c = Date.now();
        

    };

    #catchCoin(){
        const playerDraw = this.player.drawAttributes;
        const entitesMap = this.grid.getEntitiesNearby(playerDraw.location.x,playerDraw.location.y);
        if(entitesMap.has(Coin.name)){
            const coinsNearby = entitesMap.get(Coin.name);
            for(let coin of coinsNearby){
                if(CollisionHandler.isPolygonsPenetrating(playerDraw.getActualShell(),coin.drawAttributes.getActualShell())){
                    this.player.money += /** @type {Coin} */ (coin).value;
                    coin.isAlive = false;
                }
            }

        }
    }

    /** @param {Coin} coin */
    #applyForceToCoin(coin){
        const coinPos = coin.drawAttributes.location;
        const playerPos = this.player.drawAttributes.location;

        const relativePos = playerPos.copy().subtract(coinPos); // coin to player
        const multiplier = 1e-3 * (this.player.motionAttributes.mass * coin.motionAttributes.mass) /  relativePos.magnitude();
        coin.motionAttributes.force.add(relativePos.normalize().multiply(multiplier));


    }

}