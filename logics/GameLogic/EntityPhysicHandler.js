// Oyun içindeki tüm entity'lerin fiziksel hareketlerini ve ivme/konum güncellemelerini yöneten handler sınıfı
class EntityPhysicHandler extends Handler {

    /**
     * Tüm entity'lerin fiziksel güncellemelerini yapar
     */
    update = () => {
        const deltaTime = (global.latestPaintTimestamp - global.previousLatestPaintTimestamp) / 7;
        this.grid.applyToAllEntities((entity) => {
            if (entity.isStatic) return;
            this.#updateAngularAcceleration(entity, deltaTime);
            this.#updateAngle(entity, deltaTime);
            this.#applyAcceleration(entity);
            this.#applySpeed(entity, deltaTime);
            this.#updateLocation(entity, deltaTime);
        });
    };

    /**
     * Entity'ye kuvvetten ivme uygular
     * @param {Entity} entity
     */
    #applyAcceleration(entity) {
        const acceleration = entity.motionAttributes.force
            .copy()
            .divide(entity.motionAttributes.mass);
        entity.motionAttributes.acceleration.add(acceleration);
    }

    /**
     * Entity'nin hızını ivmeden günceller
     * @param {Entity} entity
     * @param {number} dt - Zaman farkı
     */
    #applySpeed(entity, dt) {
        const motion = entity.motionAttributes;
        const slowdownRate = motion.velocitySlowdownRate;
        const deltaV = motion.acceleration.copy().multiply(dt);
        motion.velocity.add(deltaV);
        motion.velocity.multiply(slowdownRate);
        if (motion.velocity.magnitude() > motion.maxVelocity) {
            motion.velocity = motion.velocity
                .normalize()
                .multiply(motion.maxVelocity);
        }
    }

    /**
     * Entity'nin konumunu hızdan günceller
     * @param {Entity} entity
     * @param {number} dt - Zaman farkı
     */
    #updateLocation(entity, dt) {
        const location = entity.drawAttributes.location;
        const velocity = entity.motionAttributes.velocity;
        location.x += velocity.x * dt;
        location.y += velocity.y * dt;
    }

    /**
     * Entity'nin açısal ivmesini günceller
     * @param {Entity} entity
     * @param {number} dt - Zaman farkı
     */
    #updateAngularAcceleration(entity, dt) {
        const motion = entity.motionAttributes;
        const angularAcceleration = motion.torque / motion.momentOfInertia;
        motion.angularVelocity += angularAcceleration * dt;
    }

    /**
     * Entity'nin açısını açısal hızdan günceller
     * @param {Entity} entity
     * @param {number} dt - Zaman farkı
     */
    #updateAngle(entity, dt) {
        const motion = entity.motionAttributes;
        const draw = entity.drawAttributes;
        const maxAngularVelocity = motion.maxAngularVelocity;
        const slowdownRate = motion.angularSlowdownRate;
        if (Math.abs(motion.angularVelocity) > maxAngularVelocity) {
            motion.angularVelocity =
                motion.angularVelocity > 0
                    ? maxAngularVelocity
                    : -maxAngularVelocity;
        }
        motion.angularVelocity *= slowdownRate;
        draw.angle += motion.angularVelocity * dt;
    }
}
