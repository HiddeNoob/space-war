class BulletHitHandler extends Handler{
    /**
     * Tüm entity'lerin mermilerle çarpışmalarını kontrol eder
     */
    update = () => {
        this.grid.applyToVisibleEntityPairs(
        (/** @type {Bullet} */ bullet, /** @type {Entity} */ entity) => {
            if(!entity.canCollide) return;
            const collide = bullet.isCollidingWith(entity);
            if (collide) {
                const {line1: bulletLine, line2: entityLine, point} = collide;

                // çarpışma büyüklüğü hız ile hesaplanır
                const impactSize = bullet.motionAttributes.velocity.copy().multiply(-1).add(entity.motionAttributes.velocity).magnitude();

                // kim daha dayanıklı ?
                const durabilityRate = bulletLine.durability / entityLine.durability;

                const bulletDamage = bullet.damage * impactSize * durabilityRate; // merminin verdiği hasar
                const entityDamage = impactSize / durabilityRate; // entity'nin verdiği hasar

                this.player.xp += bulletDamage / 10;
                this.player.levelUp();

                // birbirlerini yok etmesi için gereken vuruş sayısı
                let minimumShotToDestroyEntity = entityLine.health / bulletDamage
                let minimumShotToDestroyBullet = bulletLine.health / entityDamage

                if(minimumShotToDestroyBullet > minimumShotToDestroyEntity){ // eğer mermi daha kolay yok edebiliyorsa, entityi yok et
                    EntityTerminater.deadEntitiesQueue.push(entity);

                    // entitynin yok olduğu yerde coin oluştur
                    const location = entity.drawAttributes.location;
                    const coin = Coin.create(location.x, location.y, entityLine.durability,entityLine.durability + 2);
                    this.grid.addEntity(coin);
                    

                    // aynı şekilde mermi de hasar alır çünkü çarpıştılar
                    bulletLine.health -= entityDamage;

                    // eğer merminin canı bittiyse yok et
                    if(bulletLine.health <= 0){
                        EntityTerminater.deadEntitiesQueue.push(bullet);
                    }
                }else{ // eğer entity daha kolay yok edebiliyorsa, mermiyi yok et
                    EntityTerminater.deadEntitiesQueue.push(bullet);
                    entityLine.health -= bulletDamage;
                    if(entityLine.health <= 0){
                        EntityTerminater.deadEntitiesQueue.push(entity);
                        const location = entity.drawAttributes.location;
                        const coin = Coin.create(location.x, location.y, entityLine.durability,entityLine.durability + 2);
                        this.grid.addEntity(coin);
                    }
                }

                SFXPlayer.sfxs["hurt"].play();

            }


        },
        this.camera,
        Bullet.name
    );
        
    };
}
    