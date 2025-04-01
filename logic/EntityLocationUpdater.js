class EntityLocationUpdater {
    /** @type {Canvas} */
    canvas;
  
    /** @type {Vector} */
    latestClientMouseLocation = new Vector([0, 0]);
  
    constructor(ctx) {
        this.canvas = ctx;
    }
  
    update() {
        this.applyAcceleration(); // if there is a force
        this.applySpeed();
        this.updateLocation();
    }
  
    applyAcceleration() {
        this.canvas.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                entity.motionAttributes.acceleration.add(
                    entity.motionAttributes.force.multiply(1 / entity.motionAttributes.mass) // force / mass = acceleration
                );
            });
        });
    }
  
    applySpeed() {
        this.canvas.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                entity.motionAttributes.speed.add(entity.motionAttributes.acceleration);
                if (entity.motionAttributes.speed.toScalar() > entity.motionAttributes.maxSpeed) {
                    entity.motionAttributes.speed = entity.motionAttributes.speed
                        .getUnitVector()
                        .multiply(entity.motionAttributes.maxSpeed);
                }
            });
        });
    }
  
    updateLocation() {
        this.canvas.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                entity.drawAttributes.location.add(entity.motionAttributes.speed);
            });
        });
    }
}
