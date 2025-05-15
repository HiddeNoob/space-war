class AttackerSpawnerHandler extends Handler {

    update = () => {
        this.movementOfAttacker();
        this.onAttackerCollideWithPlayer();
    }

    init = () => {
        Timer.addIntervalTask(new Task(Settings.default.spawnerDelay, () => {
            console.log("Spawner created");
            const gridCellSize = Settings.default.gridCellSize;
            const playerLocation = this.player.drawAttributes.location.copy();
            playerLocation.x += Math.random() * gridCellSize * 20 - gridCellSize * 10;
            playerLocation.y += Math.random() * gridCellSize * 20 - gridCellSize * 10; 
            this.createSpawner(playerLocation.x,playerLocation.y,Settings.default.attackerSpawnDelay, ReadyToUseObjects.attackers["mini-drone"]);
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
        const spawner = new AttackerSpawner(nextSpawnDelay,attackerToSpawn,20,70).setLocation(new Vector(spawnerX,spawnerY));
        this.grid.addEntity(spawner);
        const task = new Task(nextSpawnDelay, () => {
            if(!spawner.isAlive){
                Timer.removeIntervalTask(task);
                return;
            };
            const attacker = spawner.spawnAttacker();
            this.grid.addEntity(attacker);
        })
        Timer.addIntervalTask(task);
        return spawner;
    }

    movementOfAttacker() {
        this.grid.applyToCertainEntities(Attacker.name, (/** @type {Attacker} */ attacker) => {
            let direction;
            if(this.player.drawAttributes.location.distanceTo(attacker.drawAttributes.location) > Settings.default.attackerFollowDistance){ // oyuncudan uzaksa rasgele dolaşsın
                direction = attacker.drawAttributes.location.copy().add(new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1));
            }else{
                direction = this.player.drawAttributes.location.copy();
            }
            attacker.moveTo(direction);
            attacker.rotateTo(direction);
        });
    }

    onAttackerCollideWithPlayer(){
        this.grid.applyToVisibleEntityPairs((/** @type {Attacker} */ attacker, /** @type {Player} */ player) => {
            const collide = attacker.isCollidingWith(player)
            if(collide){
                const {line1 : attackerLine,line2 : playerLine,point} = collide;
                const impactSize = attacker.motionAttributes.velocity.copy().multiply(-1).add(player.motionAttributes.velocity).magnitude();
                const durabilityRate = attackerLine.durability / playerLine.durability;
                const attackerDamage = impactSize * durabilityRate; // düşmanın verdiği hasar
                playerLine.health -= attackerDamage;
                EntityTerminater.deadEntitiesQueue.push(attacker);
                if(playerLine.health <= 0)
                    EntityTerminater.deadEntitiesQueue.push(player);

                SFXPlayer.sfxs["explosion"].play();
            }

        },
        this.camera,
        Attacker.name,
        Player.name);
    }
}