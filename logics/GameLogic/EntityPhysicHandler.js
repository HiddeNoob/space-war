class EntityPhysicHandler extends Handler {

    /**
     * @param {Grid} grid
     * @param {Player} player
     */
    constructor(grid, player) {
        super(grid, player);
    }

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

    #applyAcceleration(entity) {
        const acceleration = entity.motionAttributes.force
            .copy()
            .divide(entity.motionAttributes.mass);
        entity.motionAttributes.acceleration.add(acceleration);
    }

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

    #updateLocation(entity, dt) {
        const location = entity.drawAttributes.location;
        const velocity = entity.motionAttributes.velocity;
        location.x += velocity.x * dt;
        location.y += velocity.y * dt;
    }

    #updateAngularAcceleration(entity, dt) {
        const motion = entity.motionAttributes;
        const angularAcceleration = motion.torque / motion.momentOfInertia;
        motion.angularVelocity += angularAcceleration * dt;
        motion.torque = 0;
    }

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
