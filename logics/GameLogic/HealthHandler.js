// Oyun içindeki health (sağlık) objelerinin yönetimini sağlayan handler sınıfı
class HealthHandler extends Handler{

    /**
     * Health'lere kuvvet uygular ve oyuncunun sağlık paketlerini yakalamasını kontrol eder
     */
    update = () => {
        this.grid.applyToCertainEntities(Health.name,(entity) => {
            this.#applyForceToHealth(/** @type {Health} */ (entity));
        });
        this.#catchHealth();
    };

    /**
     * Oyuncuya yakın health paketlerini yakalar ve oyuncunun sağlığını yeniler
     * Health yakalanınca isAlive false yapılır
     */
    #catchHealth(){
        const playerDraw = this.player.drawAttributes;
        const entitesMap = this.grid.getEntitiesNearby(playerDraw.location.x,playerDraw.location.y);
        if(entitesMap.has(Health.name)){
            const healthsNearby = entitesMap.get(Health.name);
            for(let health of healthsNearby){
                if(playerDraw.getActualShell().isPenetrating(health.drawAttributes.getActualShell())){
                    // Sağlık yüzdesi üzerinden iyileştirme yap (ör. %10)
                    const healPercent = /** @type {Health} */ (health).healPercent;
                    const playerLines = this.player.drawAttributes.shell.lines;
                    for(let line of playerLines){
                        const add = Math.round(line.maxHealth * healPercent);
                        line.health = Math.min(line.maxHealth, line.health + add);
                    }
                    health.isAlive = false;
                    SFXPlayer.sfxs["health-recharge"].play();
                }
            }
        }
    }

    /**
     * Health'e oyuncudan gelen çekim kuvvetini uygular
     * @param {Health} health - Kuvvet uygulanacak health
     */
    #applyForceToHealth(health){
        const healthPos = health.drawAttributes.location;
        const playerPos = this.player.drawAttributes.location;
        const relativePos = playerPos.copy().subtract(healthPos); // health to player
        const multiplier = 1e-2 * (this.player.motionAttributes.mass * health.motionAttributes.mass) /  relativePos.magnitude();
        health.motionAttributes.force.add(relativePos.normalize().multiply(multiplier));
    }
}
