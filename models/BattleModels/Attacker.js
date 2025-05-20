// Saldırı yapabilen (ateş edebilen) entity'leri temsil eden ana sınıf
class Attacker extends Entity {
    /** @type {Weapon[]} */
    weapons; // Saldırı silahı

    /** @type {Number} */
    currentWeaponIndex = 0; // Geçerli silah indeksi

    /** @type {number} */
    thrustPower; // İleri itme gücü

    /** @type {number} */
    rotatePower; // Dönme gücü

    /**
     * Attacker oluşturucu
     * @param {DrawAttributes} drawAttributes - Çizim özellikleri
     * @param {MotionAttributes} motionAttributes - Fiziksel özellikler
     * @param {Weapon[]} weapons - Sahip Olduğu silahlar
     */
    constructor(
        weapons = [new Weapon()],
        drawAttributes = new DrawAttributes(ShapeFactory.polygonToShell(GlobalShapes.TRIANGLE)),
        motionAttributes = new MotionAttributes(1, 2)
    ) {
        super(drawAttributes, motionAttributes);
        this.weapons = weapons;
        this.motionAttributes.angularSlowdownRate = 0.85;
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
     * - Her karede verilen oran kadar hızla çarpar.
     * - speed *= slowdownRate
     * @param {Number} value 
     * @returns {this}
     */
    setVelocitySlowdownRate(value) {
        this.motionAttributes.velocitySlowdownRate = value;
        return this;
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
        this.weapons[this.currentWeaponIndex].reload();
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
        const bullet = this.weapons[this.currentWeaponIndex].shoot(bulletLocation, bulletAngle);
        if (bullet) {
            const bulletMomentum = bullet.motionAttributes.mass * bullet.motionAttributes.velocity.magnitude();
            const deltaVelocity = new Vector(
                -Math.cos(bulletAngle),
                -Math.sin(bulletAngle)
            ).multiply((bulletMomentum / this.motionAttributes.mass));
            this.motionAttributes.velocity.add(deltaVelocity);
            return bullet;
        }
        return null;
    }

    /**
     * Verilen konuma doğru dönüp ateş eder
     * @param {Vector} targetLocation
     * @return {Bullet | null} - Ateş edildiyse mermi, yoksa null
     */
    shootTo(targetLocation) {
        this.rotateTo(targetLocation);
        return this.shoot();
    }

    changeWeapon(index) {
        if (index < 0 || index >= this.weapons.length) {
            return;
        }
        this.currentWeaponIndex = index;
    }

    copy() {
        const clonedWeapons = this.weapons.map(weapon => weapon.copy());
        const clonedAttacker = new Attacker(
            clonedWeapons,
            this.drawAttributes.copy(),
            this.motionAttributes.copy()
        );
        clonedAttacker.thrustPower = this.thrustPower;
        clonedAttacker.rotatePower = this.rotatePower;
        return clonedAttacker;
    }
}