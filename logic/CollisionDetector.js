class CollisionDetector {
    /** @type {Grid} grid */
    #grid;

    /** @param {Grid} grid */
    constructor(grid) {
        this.#grid = grid;
    }

    #getCollidingLinesIfExists(e1, e2) {
        const array = [];
        for (let i = 0; i < e1.drawAttributes.shell.breakableLines.length; i++) {
            let e1L = e1.drawAttributes.shell.breakableLines[i]
                .copy()
                .rotateLine(e1.drawAttributes.angle)
                .moveLine(e1.drawAttributes.location.x, e1.drawAttributes.location.y);
            for (let j = 0; j < e2.drawAttributes.shell.breakableLines.length; j++) {
                let e2L = e2.drawAttributes.shell.breakableLines[j]
                    .copy()
                    .rotateLine(e2.drawAttributes.angle)
                    .moveLine(e2.drawAttributes.location.x, e2.drawAttributes.location.y);

                if (e2L.isIntersectsWith(e1L)) {
                    array.push([e2L, e1L]);
                }
            }
        }
        return array;
    }

    makeCollisions() {
        this.#grid.cells.forEach((entities) => {
            entities.forEach((entity1) => {
                const nearbyEntities = this.#grid.getEntitiesNearby(
                    entity1.drawAttributes.location.x, 
                    entity1.drawAttributes.location.y
                );

                nearbyEntities.forEach((entity2) => {
                    if (entity1 !== entity2) {
                        const collidingLines = this.#getCollidingLinesIfExists(entity1, entity2);
                        if (collidingLines.length > 0) {
                            let collisionNormal = entity2.drawAttributes.location.copy()
                                .subtract(entity1.drawAttributes.location)
                                .normalize();

                            let tangent = new Vector(-collisionNormal.y, collisionNormal.x);

                            let velocity1Normal = collisionNormal.dot(entity1.motionAttributes.speed);
                            let velocity2Normal = collisionNormal.dot(entity2.motionAttributes.speed);
                            
                            let velocity1Tangent = tangent.dot(entity1.motionAttributes.speed);
                            let velocity2Tangent = tangent.dot(entity2.motionAttributes.speed);

                            let m1 = entity1.motionAttributes.mass;
                            let m2 = entity2.motionAttributes.mass;

                            let newVelocity1Normal = ((m1 - m2) / (m1 + m2)) * velocity1Normal +
                                                     ((2 * m2) / (m1 + m2)) * velocity2Normal;

                            let newVelocity2Normal = ((2 * m1) / (m1 + m2)) * velocity1Normal +
                                                     ((m2 - m1) / (m1 + m2)) * velocity2Normal;

                            entity1.motionAttributes.speed = 
                                collisionNormal.multiply(newVelocity1Normal)
                                .add(tangent.multiply(velocity1Tangent));

                            entity2.motionAttributes.speed = 
                                collisionNormal.multiply(newVelocity2Normal)
                                .add(tangent.multiply(velocity2Tangent));
                        }
                    }
                });
            });
        });
    }
}
