class EntityPhysicHandler extends Handler {

    /**
     * @param {Grid} grid
     * @param {Player} player
     */
    constructor(grid, player) {
        super(grid, player);
    }

    update = () => {
        const deltaTime = (globalGameVariables.latestPaintTimestamp - globalGameVariables.previousLatestPaintTimestamp) / 7;
        this.#updateAngle(deltaTime);
        this.#applyAcceleration(deltaTime); // if there is a force
        this.#applySpeed(deltaTime);
        this.#updateLocation(deltaTime);
    };

    #applyAcceleration(dt) {
        this.grid.applyToAllEntities((entity) => {
            const acceleration = entity.motionAttributes.force
                .copy()
                .divide(entity.motionAttributes.mass)
            entity.motionAttributes.acceleration.add(acceleration);
        });
    }

    #applySpeed(dt) {
        this.grid.applyToAllEntities((entity) => {
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
        });
    }

    #updateLocation(dt) {
        this.grid.applyToAllEntities((entity) => {
            const location = entity.drawAttributes.location;
            const velocity = entity.motionAttributes.velocity;

            location.x += velocity.x * dt;
            location.y += velocity.y * dt;
        });
    }

    #updateAngle(dt) {
        this.grid.applyToAllEntities((entity) => {
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
        });
    }
}
