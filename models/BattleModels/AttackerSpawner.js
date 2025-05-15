
class AttackerSpawner extends Entity {
    /**@type {Number} */
    spawnDelay; // Spawn gecikmesi

    /**
     * @param {Attacker} attackerToSpawn - Spawn edilecek düşman
     * @param {number} spawnDelay - Spawn gecikmesi
     */
    constructor(spawnDelay = 5000,attackerToSpawn = new Attacker(),durability = 1,health = 1){
        super(new DrawAttributes(ShapeFactory.polygonToShell(ShapeFactory.createRegularPolygon(8,20),durability,health,health)),new MotionAttributes());
        this.spawnDelay = spawnDelay;
        this.attackerToSpawn = attackerToSpawn;
        this.motionAttributes.velocitySlowdownRate = 0.99;
    }

    spawnAttacker(){
        const attacker = this.attackerToSpawn.copy()
        console.log("Attacker Spawned");
        console.log(attacker);
        attacker.setLocation(this.drawAttributes.location.copy());
        this.#moveAttackerOuter(attacker);
        return attacker;
    }

    /**
     * Spawn edilen düşmanı çarpışmaması için spawnerın dışına hareket ettirir
     * @param {Attacker} attacker - Hareket ettirilecek düşman
     */
    #moveAttackerOuter(attacker){
        const overlap = attacker.drawAttributes.getActualShell().minOverlapping(this.drawAttributes.getActualShell());
        if(overlap === null) return attacker;
        const { minOverlap, smallestAxis } = overlap;
        attacker.drawAttributes.location.add(smallestAxis.copy().multiply(minOverlap));
        attacker.motionAttributes.velocity.add(smallestAxis.copy().normalize().multiply(0.5));
        return attacker;
    }
}