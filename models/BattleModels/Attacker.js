class Attacker extends Entity {
    /** @type {Weapon} */
    weapon;

    /** @type {number} */
    thrustPower;

    /** @type {number} */
    rotatePower;

    /**
     * @param {DrawAttributes} drawAttributes
     * @param {MotionAttributes} motionAttributes
     * @param {Weapon} weapon
     */
    constructor(
        drawAttributes = new DrawAttributes(PlayerShapes.DEFAULT_PLAYER),
        motionAttributes = new MotionAttributes(1, 10000),
        weapon = new Weapon()
    ) {
        super(drawAttributes, motionAttributes);
        this.weapon = weapon;

        this.motionAttributes.angularSlowdownRate = 0.90;
        this.thrustPower = motionAttributes.mass * 1e-2;
        this.rotatePower = motionAttributes.momentOfInertia * 1e-2;
    }

    /**
     * @param {Vector} vector
     */
    moveTo(vector) {
        const direction = vector.copy().subtract(this.drawAttributes.location).normalize();
        this.motionAttributes.force.add(direction.multiply(this.thrustPower));
    }

    /**
     * @param {Vector} targetLocation
     */
    rotateTo(targetLocation) {
        const directionToTarget = targetLocation.copy().subtract(this.drawAttributes.location);

        const targetAngle = directionToTarget.angle();

        let angleDifference = targetAngle - this.drawAttributes.angle;

        angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));

        this.motionAttributes.torque += angleDifference * this.rotatePower;
    }

    /**
     */
    shoot() {
        const bulletAngle = this.drawAttributes.angle;

        const tipOfAttacker = this.drawAttributes.shell.lines[0].startPoint;
        const bulletLocation = this.drawAttributes.location
            .copy()
            .add(tipOfAttacker.copy().rotate(bulletAngle).multiply(2));

        const bullet = this.weapon.shoot(bulletLocation, bulletAngle);

        if (bullet) {
            global.game.canvasObject.grid.addEntity(bullet);

            const bulletMomentum = bullet.motionAttributes.mass * bullet.motionAttributes.velocity.magnitude();
            const recoilForce = new Vector(
                -Math.cos(bulletAngle),
                -Math.sin(bulletAngle)
            ).multiply(bulletMomentum / this.motionAttributes.mass);

            this.motionAttributes.force.add(recoilForce);
        }
    }

    /**
     * @param {Vector} targetLocation
     */
    shootTo(targetLocation) {
        this.rotateTo(targetLocation);
        this.shoot();
    }
}