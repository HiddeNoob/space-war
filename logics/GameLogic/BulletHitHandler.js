class BulletHitHandler extends Handler{
    /**
     * Tüm entity'lerin mermilerle çarpışmalarını kontrol eder
     */
    update = () => {
        this.grid.applyToVisibleEntityPairs(
        (/** @type {Bullet} */ entity1, /** @type {Entity} */ entity2) => {
            const collide = entity1.isCollidingWith(entity2);
            if (collide) {
                const {line1, line2, point} = collide;
                const impactSize = entity1.motionAttributes.velocity.copy().multiply(-1).add(entity2.motionAttributes.velocity).magnitude() * 100;
                const durabilityRate = line1.durability / line2.durability;
                const entity1Damage = entity1.damage * impactSize * durabilityRate; // merminin verdiği hasar
                const entity2Damage = impactSize * durabilityRate; // entity'nin verdiği hasar

                line1.health -= entity2Damage;
                line2.health -= entity1Damage;
                console.log("Entity1 Health: ", line1.health);
                console.log("Entity2 Health: ", line2.health);

                if(line1.health <= 0)
                    EntityTerminater.deadEntitiesQueue.push(entity1);
                if(line2.health <= 0)
                    EntityTerminater.deadEntitiesQueue.push(entity2);

            }
        },
        this.camera,
        Bullet.name
    );
        
    };
}
    