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

    /**
     * Kuyruktaki ölü entity'leri parçalarına ayırıp patlama animasyonu başlatır
     */
    #processDeadEntites(){
        while(EntityTerminater.deadEntitiesQueue.length > 0){ // TODO: Bu algoritma iyileştirilmeli
            /** @type {Entity} */
            const deadEntity = EntityTerminater.deadEntitiesQueue.pop();
            deadEntity.isAlive = false;
            const entitySpeedVector = deadEntity.motionAttributes.velocity;
            const bodyPartCount = deadEntity.drawAttributes.shell.lines.length;
            const unitVector = new Vector(1,0); // Her iterasyonda tekrar oluşturulmaması için
            for(let i = 0; i < bodyPartCount ; i++){ // Patlama animasyonu için
                const selectedLine = deadEntity.drawAttributes.shell.lines[i];
                if(selectedLine.health <= 0) continue;
                const angle = i * (2 * Math.PI) / bodyPartCount;
                const location = deadEntity.drawAttributes.location;
                const lineLocation = location.add(selectedLine.centerPoint());
                const speed = (unitVector.copy().rotate(angle).add(entitySpeedVector));
                const motionAttributes = new MotionAttributes();
                const drawAttributes = new DrawAttributes(new Polygon([selectedLine]),lineLocation);
                motionAttributes.velocity = speed;
                this.grid.addEntity(new Entity(drawAttributes,motionAttributes));
            }
        }
    }
}