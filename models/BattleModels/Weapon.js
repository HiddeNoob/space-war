class Weapon extends Entity{
    /** @type {string} */
    weaponName;
    /** @type {number} */
    bulletEjectPower
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
    constructor(weaponName = "Weapon", bulletEjectPower = 70, maxBulletPerMagazine = 30, remainingBullet = 30, bulletObject = new Bullet()) {
        super();
        this.weaponName = weaponName;
        this.bulletEjectPower = bulletEjectPower;
        this.maxBulletPerMagazine = maxBulletPerMagazine;
        this.remainingBullet = remainingBullet;
        this.bulletObject = bulletObject;
    }
}