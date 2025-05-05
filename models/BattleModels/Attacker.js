// Saldırı yapabilen (ateş edebilen) entity'leri temsil eden ana sınıf
class Attacker extends Entity {
    /** @type {Weapon} */
    weapon; // Saldırı silahı

    /** @type {number} */
    thrustPower; // İleri itme gücü

    /** @type {number} */
    rotatePower; // Dönme gücü

    /**
     * Attacker oluşturucu
     * @param {DrawAttributes} drawAttributes - Çizim özellikleri
     * @param {MotionAttributes} motionAttributes - Fiziksel özellikler
     * @param {Weapon} weapon - Silah
     */
    constructor(
        drawAttributes = new DrawAttributes(PlayerShapes.DEFAULT_PLAYER),
        motionAttributes = new MotionAttributes(1, 2),
        weapon = new Weapon()
    ) {
        super(drawAttributes, motionAttributes);
        this.weapon = weapon;
        this.motionAttributes.angularSlowdownRate = 0.90;
        this.thrustPower = motionAttributes.mass * 1e-2;
        this.rotatePower = motionAttributes.momentOfInertia * 1e-2;
    }

    /**
     * Verilen vektöre doğru hareket eder
     * @param {Vector} vector
     */
    moveTo(vector) {
        const direction = vector.copy().subtract(this.drawAttributes.location).normalize();
        this.motionAttributes.force.add(direction.multiply(this.thrustPower));
    }

    /**
     * Verilen konuma doğru döner
     * @param {Vector} targetLocation
     */
    rotateTo(targetLocation) {
        const directionToTarget = targetLocation.copy().subtract(this.drawAttributes.location);
        const targetAngle = directionToTarget.angle();
        let angleDifference = targetAngle - this.drawAttributes.angle;
        angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));
        this.motionAttributes.torque += angleDifference * this.rotatePower;
    }

    reloadWeapon() {
        this.weapon.reload();
    }

    /**
     * Ateş eder (bir mermi oluşturur ve geri tepme uygular)
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
            const deltaVelocity = new Vector(
                -Math.cos(bulletAngle),
                -Math.sin(bulletAngle)
            ).multiply((bulletMomentum / this.motionAttributes.mass));
            this.motionAttributes.velocity.add(deltaVelocity);
        }
    }

    /**
     * Verilen konuma doğru dönüp ateş eder
     * @param {Vector} targetLocation
     */
    shootTo(targetLocation) {
        this.rotateTo(targetLocation);
        this.shoot();
    }
}