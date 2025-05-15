// Oyun içindeki coin (para) objelerinin yönetimini sağlayan handler sınıfı
class CoinHandler extends Handler{

    /**
     * Coin'lere kuvvet uygular ve yakalanan coin'leri kontrol eder
     */
    update = () => {
        this.grid.applyToCertainEntities(Coin.name,(entity) => {
            this.#applyForceToCoin(/** @type {Coin} */ (entity));
        });
        this.#catchCoin();
    };

    /**
     * Oyuncuya yakın coin'leri yakalar ve oyuncunun parasını artırır
     * Coin yakalanınca isAlive false yapılır
     */
    #catchCoin(){
        const playerDraw = this.player.drawAttributes;
        const entitesMap = this.grid.getEntitiesNearby(playerDraw.location.x,playerDraw.location.y);
        if(entitesMap.has(Coin.name)){
            const coinsNearby = entitesMap.get(Coin.name);
            for(let coin of coinsNearby){
                if(playerDraw.getActualShell().isPenetrating(coin.drawAttributes.getActualShell())){
                    this.player.money += /** @type {Coin} */ (coin).value;
                    coin.isAlive = false;
                    SFXPlayer.sfxs["coin-catch"].play();
                }
            }
        }
    }

    /**
     * Coin'e oyuncudan gelen çekim kuvvetini uygular
     * @param {Coin} coin - Kuvvet uygulanacak coin
     */
    #applyForceToCoin(coin){
        const coinPos = coin.drawAttributes.location;
        const playerPos = this.player.drawAttributes.location;
        const relativePos = playerPos.copy().subtract(coinPos); // coin to player
        const multiplier = 1e-2 * (this.player.motionAttributes.mass * coin.motionAttributes.mass) /  relativePos.magnitude();
        coin.motionAttributes.force.add(relativePos.normalize().multiply(multiplier));
    }
}