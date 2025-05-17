// Oyun içindeki ölü entity'leri işleyen ve patlama animasyonlarını yöneten handler sınıfı
class EntityTerminater extends Handler{
    /** @type {Entity[]} */
    static deadEntitiesQueue = [] // Ölü entity'lerin kuyruğu

    /**
     * Kuyruktaki ölü entity'leri işler
     */
    update = () => {
        this.#processDeadEntites();
    }

    #processDeadEntites(){
        while(EntityTerminater.deadEntitiesQueue.length > 0){
            /** @type {Entity} */
            const deadEntity = EntityTerminater.deadEntitiesQueue.pop();
            deadEntity.isAlive = false;
            deadEntity.onDeconstruct.forEach((callback) => {
                callback();
            });
            if(!(deadEntity instanceof Bullet)){
                SFXPlayer.sfxs["explosion"].play();
            }
        }
    }

    
}