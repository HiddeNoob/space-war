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
                const impactSize = bullet.motionAttributes.velocity.copy().multiply(-1).add(entity.motionAttributes.velocity).magnitude() * 100;
                const durabilityRate = bulletLine.durability / entityLine.durability;
                const bulletDamage = bullet.damage * impactSize * durabilityRate; // merminin verdiği hasar
                const entityDamage = impactSize / durabilityRate; // entity'nin verdiği hasar

                bulletLine.health -= entityDamage;
                entityLine.health -= bulletDamage;

                if(bulletLine.health <= 0)
                    EntityTerminater.deadEntitiesQueue.push(bullet);
                if(entityLine.health <= 0)
                    EntityTerminater.deadEntitiesQueue.push(entity);

                SFXPlayer.sfxs["hurt"].play();

            }
        },
        this.camera,
        Bullet.name
    );
        
    };
}
    