class AttackerSpawnerHandler extends Handler {

    update = () => {
        this.moveToPlayer();
        this.attackToPlayer();
    }

    init = () => {
        Timer.addIntervalTask(new Task(Settings.default.spawnerDelay, () => {
            console.log("Spawner created");
            const playerLocation = this.player.drawAttributes.location.copy();
            playerLocation.x += Math.random() * 1000 - 500;
            playerLocation.y += Math.random() * 1000 - 500; 
            this.createSpawner(playerLocation.x,playerLocation.y,Settings.default.attackerSpawnDelay, new Attacker());
        }));

    }
    /**
     * 
     * @param {number} spawnerX 
     * @param {number} spawnerY 
     * @param {number} nextSpawnDelay 
     * @param {Attacker} attackerToSpawn 
     */
    createSpawner(spawnerX,spawnerY,nextSpawnDelay,attackerToSpawn) {
        const spawner = new AttackerSpawner(nextSpawnDelay,attackerToSpawn).setLocation(new Vector(spawnerX,spawnerY));
        this.grid.addEntity(spawner);
        Timer.addIntervalTask(new Task(nextSpawnDelay, () => {
            const attacker = spawner.spawnAttacker();
            this.grid.addEntity(attacker);
        }));
        return spawner;
    }

    attackToPlayer() {
        this.grid.applyToCertainEntities(Attacker.name, (/** @type {Attacker} */ attacker) => {
            attacker.shootTo(this.player.drawAttributes.location);         
        });
    }

    moveToPlayer() {
        this.grid.applyToCertainEntities(Attacker.name, (/** @type {Attacker} */ attacker) => {
            attacker.moveTo(this.player.drawAttributes.location);         
        });
    }
}