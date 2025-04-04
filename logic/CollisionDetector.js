class CollisionDetector {
    /** @type {Grid} grid */
    #grid;

    /** @param {Grid} grid */
    constructor(grid) {
        this.#grid = grid;
    }

    makeCollisions() {
        /** @type {Map<any,Set>} */
        const processedEntites = new Map();
        const addRelate = (entity1,entity2) => {
            if(!processedEntites.get(entity1))
                processedEntites.set(entity1,new Set());
            
            processedEntites.get(entity1).add(entity2)
            
            if(!processedEntites.get(entity2))
                processedEntites.set(entity2,new Set());
            processedEntites.get(entity2).add(entity1)
            
        } 
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
                            

                            if(processedEntites.get(entity1) && processedEntites.get(entity1).has(entity2))
                                return;


                            /** @type {Line} */
                            const e1L = collidingLines[0][0];

                            /** @type {Line} */
                            const e2L = collidingLines[0][1];
                            
                            /** @type {Vector} */
                            const collidePoint = collidingLines[0][2];
                            this.showPoint(collidePoint);
                            
                            const merkez1 = entity1.drawAttributes.location;
                            const merkez2 = entity2.drawAttributes.location;
                            
                            const yaricap1 = collidePoint.copy().subtract(merkez1);
                            const yaricap2 = collidePoint.copy().subtract(merkez2);
                            const v1 = entity1.motionAttributes.speed.copy().add(yaricap1.copy().multiply(entity1.motionAttributes.angularVelocity));
                            const v2 = entity2.motionAttributes.speed.copy().add(yaricap2.copy().multiply(entity2.motionAttributes.angularVelocity));
                            const goreceliHiz = v2.copy().subtract(v1);

                            const n1 = e1L.copy().rotateLine(entity1.drawAttributes.angle).normalVector().multiply(-1);
                            const n2 = e2L.copy().rotateLine(entity2.drawAttributes.angle).normalVector().multiply(-1);

                            const dot1 = n1.dot(goreceliHiz);
                            const dot2 = n2.dot(goreceliHiz);

                            // hangisi göreceli hıza daha zıt yönlüyse o normal alınır
                            const carpismaNormali = Math.abs(dot1) > Math.abs(dot2) ? n1 : n2;
                            

                            
                            this.drawVector(carpismaNormali.copy().multiply(20),collidePoint)

                            const normalUzerindekiHiz = carpismaNormali.copy().dot(goreceliHiz);

                            const normalCrossY1 = carpismaNormali.copy().crossProduct(yaricap1);
                            const normalCrossY2 = carpismaNormali.copy().crossProduct(yaricap2);

                            let denom = (1 / entity1.motionAttributes.mass) + (1 / entity2.motionAttributes.mass) + 
                                        (normalCrossY1 ** 2) / entity1.motionAttributes.momentOfInertia +
                                        (normalCrossY2 ** 2) / entity2.motionAttributes.momentOfInertia;

                            const e = 0.5 // carpisma enerji korunumu
                            let j = -(1 + e) * normalUzerindekiHiz / denom;

                            let impulse = carpismaNormali.copy().multiply(j);
                            this.drawVector(impulse,collidePoint);
                            // hiz degisimi
                            entity1.motionAttributes.speed.subtract(impulse.copy().multiply((1 / entity1.motionAttributes.mass)));
                            entity2.motionAttributes.speed.add(impulse.copy().multiply((1 / entity2.motionAttributes.mass)));

                            //tork degisimi
                            entity1.motionAttributes.angularVelocity -= yaricap1.crossProduct(impulse) / (entity1.motionAttributes.momentOfInertia * 100)
                            entity2.motionAttributes.angularVelocity += yaricap2.crossProduct(impulse) / (entity2.motionAttributes.momentOfInertia * 100)




                            // if(entity1 instanceof Bullet){
                            //     this.#updateEntityWithBulletCollision(entity1,entity2,collidingLines[0][0],collidingLines[0][1])
                            // }else if(entity2 instanceof Bullet){
                            //     this.#updateEntityWithBulletCollision(entity2,entity1,collidingLines[0][1],collidingLines[0][0])
                            // }

                            addRelate(entity1,entity2);
                        }
                    }
                });
            });
        });
    }

    /** @param {Vector} vector */
    drawVector(vector,startVector = new Vector(0,0)){
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(startVector.x,startVector.y)
        ctx.lineTo(vector.x + startVector.x,vector.y + startVector.y);
        ctx.stroke();
    }
    
    /** @param {Vector} vector */
    showPoint(vector){
        ctx.beginPath();
        ctx.arc(vector.x,vector.y,1,0,2 * Math.PI);
        ctx.stroke();
    }

    /**
     * 
     * @param {Entity} e1 
     * @param {Entity} e2 
     */
    #getCollidingLinesIfExists(e1, e2) {
        /** @type {Array[]} */
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
                    const intersectPoint = Line.getIntersectPoint(e2L,e1L);
                    array.push([e1.drawAttributes.shell.breakableLines[i], e2.drawAttributes.shell.breakableLines[j],intersectPoint]);
                }
            }
        }
        return array;
    }



    /**
     * 
     * @param {Bullet} bullet 
     * @param {Entity} entity 
     * @param {BreakableLine} bulletLine 
     * @param {BreakableLine} entityLine 
     */
    #updateEntityWithBulletCollision(bullet,entity,bulletLine,entityLine){
        const collisionSpeedMagnitude = bullet.motionAttributes.speed.copy().multiply(-1).add(entity.motionAttributes.speed).magnitude();
        const durabilityRate = entityLine.durability / bulletLine.durability;

        // pek bir matematik yok sadece orantı yazdım 
        const entityHealthAfterCollision = entityLine.health - collisionSpeedMagnitude * bullet.damage   / durabilityRate;
        const bulletHealthAfterCollision = bulletLine.health - collisionSpeedMagnitude * durabilityRate;
        
        entityLine.health = entityHealthAfterCollision;
        bulletLine.health = bulletHealthAfterCollision;

        if(entityLine.health <= 0) EntityTerminater.deadEntitiesQueue.push(entity);
        if(bulletLine.health <= 0) EntityTerminater.deadEntitiesQueue.push(bullet);
    }
}
