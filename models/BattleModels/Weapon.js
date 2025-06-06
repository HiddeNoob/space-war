// Oyunda kullanılan silahları ve mermi üretimini yöneten sınıf
class Weapon {

    isReloading = false; // Yeniden doldurma işlemi yapılıyor mu

    /** @type {string} */
    weaponName; // Silahın adı

    /** @type {number} */
    bulletEjectPower; // Mermi çıkış gücü

    /** @type {number} */
    remainingBullet; // Kalan mermi sayısı

    /** @type {Bullet} */
    bulletObject; // Mermi şablonu

    /** @type {number} */
    maxBulletPerMagazine; // Şarjördeki maksimum mermi

    /** @type {number} */
    reloadTime; // Yeniden doldurma süresi

    /** @type {number} */
    shotDelayTime;

    /** @type {number} */
    latestShotTimestamp = Date.now();

    /**
     * Weapon oluşturucu
     * @param {string} weaponName - Silah adı
     * @param {number} bulletEjectPower - Mermi çıkış gücü
     * @param {number} maxBulletPerMagazine - Şarjör kapasitesi
     * @param {number} remainingBullet - Başlangıç mermi sayısı
     * @param {Bullet} bulletObject - Mermi şablonu
     * @param {number} reloadTime - Şarjör Değiştirme Süresi (ms)
     */
    constructor(
        weaponName = "Weapon",
        bulletEjectPower = 50,
        maxBulletPerMagazine = 30,
        shotPerSecond = 10,
        reloadTime = 1000,
        remainingBullet = 30,
        bulletObject = new Bullet(3,
            new DrawAttributes(ShapeFactory.polygonToShell(ShapeFactory.createRectangle(10,3))),
            new MotionAttributes(1,5))
    ) {
        this.shotDelayTime = 1000 / shotPerSecond;
        this.weaponName = weaponName;
        this.bulletEjectPower = bulletEjectPower;
        this.maxBulletPerMagazine = maxBulletPerMagazine;
        this.remainingBullet = remainingBullet;
        this.bulletObject = bulletObject;
        this.reloadTime = reloadTime;
    }

    /**
     * Ateş etme işlemini gerçekleştirir
     * @param {Vector} bulletLocation - Merminin çıkış noktası
     * @param {number} angle - Ateş açısı (radyan)
     * @returns {Bullet | null} - Ateş edildiyse mermi, yoksa null
     */
    shoot(bulletLocation, angle) {
        // eğer şarjörde mermi yoksa veya ateş etme süresi dolmadıysa sıkma
        if (this.remainingBullet <= 0 ||
            Date.now() - this.latestShotTimestamp <= this.shotDelayTime ||
            this.isReloading
            ) 
            return null;
        
        this.latestShotTimestamp = Date.now();
        const bullet = this.bulletObject.copy();
        const bulletSpeed = this.bulletEjectPower / bullet.motionAttributes.mass;
        // Yön vektörü hesaplanır
        const direction = new Vector(1,0).rotate(angle);
        bullet.motionAttributes.velocity = direction.multiply(bulletSpeed);
        bullet.drawAttributes.location = bulletLocation.copy();
        bullet.drawAttributes.angle = angle;
        this.remainingBullet--;
        this.remainingShotDelayTime = this.shotDelayTime;
        return bullet;
    }

    /**
     * Örnek merminin hasar değerini ayarlar
     * @param {number} damage - Merminin hasar değeri
     * @returns {this}
     */
    setDamage(damage) {
        this.bulletObject.setDamage(damage);
        return this;
    }

    reload() {
        if (this.isReloading) {
            return;
        }
        console.log("Reloading...");
        this.isReloading = true;
        Timer.addOneTimeTask(new Task(this.reloadTime, () => {
            console.log("Reloaded!");
            this.remainingBullet = this.maxBulletPerMagazine;
            this.isReloading = false;
        }))
    }
    
    copy(){
        return new Weapon(
            this.weaponName,
            this.bulletEjectPower,
            this.maxBulletPerMagazine,
            1000 / this.shotDelayTime,
            this.reloadTime,
            this.remainingBullet,
            this.bulletObject.copy()
        );
    }
}