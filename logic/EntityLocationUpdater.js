class EntityLocationUpdater {
    /** @type {Canvas} */
    canvas;
  
    /** @type {Vector} */
    latestClientMouseLocation = new Vector(0,0);
  

    /** @param {Canvas} canvas */
    constructor(canvas) {
        this.canvas = canvas;
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
                    entity.motionAttributes.force.copy().divide(entity.motionAttributes.mass)
                );
            });
        });
    }
  
    applySpeed() {
        this.canvas.grid.cells.forEach((cell) => {
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
  
    updateLocation() {
        this.canvas.grid.cells.forEach((cell) => {
            cell.forEach((entity) => {
                entity.drawAttributes.location.x += entity.motionAttributes.speed.x;
                entity.drawAttributes.location.y += entity.motionAttributes.speed.y;
            });
        });
    }
}
