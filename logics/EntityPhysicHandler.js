class EntityPhysicHandler extends Handler{

    /**
     * @param {Grid} grid
     * @param {Player} player
     */
    constructor(grid,player){
        super(grid,player);
    }
  
    update = () => {
        this.#updateAngle()
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
                const slowdownRate = entity.motionAttributes.velocitySlowdownRate;
                entity.motionAttributes.velocity.add(entity.motionAttributes.acceleration);
                entity.motionAttributes.velocity.multiply(slowdownRate);
                if (entity.motionAttributes.velocity.magnitude() > entity.motionAttributes.maxVelocity) {
                    entity.motionAttributes.velocity = entity.motionAttributes.velocity
                        .normalize()
                        .multiply(entity.motionAttributes.maxVelocity);
                }
            });
        });
    }
  
    #updateLocation() {
        this.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                entity.drawAttributes.location.x += entity.motionAttributes.velocity.x;
                entity.drawAttributes.location.y += entity.motionAttributes.velocity.y;
            });
        });
    }

    #updateAngle() {
        this.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                const angularVelocity = entity.motionAttributes.angularVelocity;
                const maxAngularVelocity = 0.1;
                const slowdownRate = entity.motionAttributes.angularSlowdownRate
                if(maxAngularVelocity < Math.abs(angularVelocity)){
                    entity.motionAttributes.angularVelocity = angularVelocity > 0 ? maxAngularVelocity : -maxAngularVelocity;
                }

                entity.motionAttributes.angularVelocity *= slowdownRate;
                entity.drawAttributes.angle += angularVelocity;
            });
        });

    
      }
}
