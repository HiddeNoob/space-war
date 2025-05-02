class Weapon {
    /** @type {string} */
    weaponName;

    /** @type {number} */
    bulletEjectPower;

    /** @type {number} */
    remainingBullet;

    /** @type {Bullet} */
    bulletObject;

    /** @type {number} */
    maxBulletPerMagazine;

    /** @type {number} */
    reloadTime;

    /**
     * @param {string} weaponName
     * @param {number} bulletEjectPower
     * @param {number} maxBulletPerMagazine
     * @param {number} remainingBullet
     * @param {Bullet} bulletObject
     */
    constructor(
        weaponName = "Weapon",
        bulletEjectPower = 100,
        maxBulletPerMagazine = 30,
        remainingBullet = 30,
        bulletObject = new Bullet()
    ) {
        this.weaponName = weaponName;
        this.bulletEjectPower = bulletEjectPower;
        this.maxBulletPerMagazine = maxBulletPerMagazine;
        this.remainingBullet = remainingBullet;
        this.bulletObject = bulletObject;
    }

    /**
     * @param {Vector} bulletLocation
     * @param {number} angle
     * @returns {Bullet | null} - ateş edildiyse bir mermi döner, aksi takdirde null döner
     */
    shoot(bulletLocation, angle) {
        if (this.remainingBullet <= 0) {
            return null;
        }

        const bullet = this.bulletObject.copy();
        const bulletSpeed = this.bulletEjectPower / bullet.motionAttributes.mass;

        // Calculate direction from bulletLocation to targetLocation
        const direction = new Vector(1,0).rotate(angle);
        bullet.motionAttributes.velocity = direction.multiply(bulletSpeed);

        bullet.drawAttributes.location = bulletLocation.copy();
        bullet.drawAttributes.angle = angle;

        this.remainingBullet--;

        return bullet;
    }
}