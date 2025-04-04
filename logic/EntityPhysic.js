class EntityPhysic {
    /** @type {Grid} */
    grid;
  
    /** @type {Vector} */
    latestClientMouseLocation = new Vector(0,0);
  

    /** @param {Grid} grid */
    constructor(grid) {
        this.grid = grid;
    }
  
    update() {
        this.#updatePlayerAngle()
        this.#applyAcceleration(); // if there is a force
        this.#applySpeed();
        this.#updateLocation();
    }
    
  
    #applyAcceleration() {
        this.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                entity.motionAttributes.acceleration.add(
                    entity.motionAttributes.force.copy().divide(entity.motionAttributes.mass)
                );
            });
        });
    }
  
    #applySpeed() {
        this.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                entity.motionAttributes.speed.add(entity.motionAttributes.acceleration);
                if (entity.motionAttributes.speed.magnitude() > entity.motionAttributes.maxSpeed) {
                    entity.motionAttributes.speed = entity.motionAttributes.speed
                        .normalize()
                        .multiply(entity.motionAttributes.maxSpeed);
                }
            });
        });
    }
  
    #updateLocation() {
        this.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                entity.drawAttributes.location.x += entity.motionAttributes.speed.x;
                entity.drawAttributes.location.y += entity.motionAttributes.speed.y;
            });
        });
    }

    #updatePlayerAngle() {
        this.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                entity.drawAttributes.angle += entity.motionAttributes.angularVelocity;
            });
        });

    
      }
}
