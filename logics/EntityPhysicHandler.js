class EntityPhysicHandler extends Handler {
    /**
     * @param {Grid} grid
     * @param {Player} player
     */
    constructor(grid, player) {
        super(grid, player);
    }

    update = () => {
        this.#updateAngle();
        this.#applyAcceleration(); // if there is a force
        this.#applySpeed();
        this.#updateLocation();
    };

    #applyAcceleration() {
        this.grid.applyToAllEntities((entity) => {
            const acceleration = entity.motionAttributes.force
                .copy()
                .divide(entity.motionAttributes.mass);
            entity.motionAttributes.acceleration.add(acceleration);
        });
    }

    #applySpeed() {
        this.grid.applyToAllEntities((entity) => {
            const motion = entity.motionAttributes;
            const slowdownRate = motion.velocitySlowdownRate;

            motion.velocity.add(motion.acceleration);
            motion.velocity.multiply(slowdownRate);

            if (motion.velocity.magnitude() > motion.maxVelocity) {
                motion.velocity = motion.velocity
                    .normalize()
                    .multiply(motion.maxVelocity);
            }
        });
    }

    #updateLocation() {
        this.grid.applyToAllEntities((entity) => {
            const location = entity.drawAttributes.location;
            const velocity = entity.motionAttributes.velocity;

            location.x += velocity.x;
            location.y += velocity.y;
        });
    }

    #updateAngle() {
        this.grid.applyToAllEntities((entity) => {
            const motion = entity.motionAttributes;
            const draw = entity.drawAttributes;

            const maxAngularVelocity = 0.1;
            const slowdownRate = motion.angularSlowdownRate;

            if (Math.abs(motion.angularVelocity) > maxAngularVelocity) {
                motion.angularVelocity =
                    motion.angularVelocity > 0
                        ? maxAngularVelocity
                        : -maxAngularVelocity;
            }

            motion.angularVelocity *= slowdownRate;
            draw.angle += motion.angularVelocity;
        });
    }
}
