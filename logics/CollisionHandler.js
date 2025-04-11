class CollisionHandler extends Handler {
    /**
     * @param {Grid} grid
     * @param {Player} player
     */
    constructor(grid,player){
        super(grid,player);
    }

    update = () => {
        this.applyToEntityPairs((entity1,entity2) => {
            if(!(entity1.canCollide && entity2.canCollide)) return;
            this.#makeCollisions(entity1,entity2);
            this.#resolvePenetration(entity1,entity2);

            if(debug){
                this.#getNormals(new Polygon(entity1.drawAttributes.shell.breakableLines),entity1.drawAttributes.angle).forEach((vector) => {
                    Handler.drawVector(vector.multiply(20),entity1.drawAttributes.location)
                });
            }

        });
    }

    /**
     * @param {Entity} entity1 
     * @param {Entity} entity2 
     */
    #makeCollisions(entity1,entity2) {

            const collidingLines = this.#getCollidingLines(entity1, entity2);
            if (collidingLines.length > 0) {

                /** @type {Vector} */
                const collidePoint = new Vector();
                
                collidingLines.forEach((array) => {
                    Handler.showPoint(array[2]);
                    collidePoint.add(array[2])
                })
                collidePoint.multiply(1 / collidingLines.length);

                /** @type {Line} */
                const e1L = collidingLines[0][0];

                /** @type {Line} */
                const e2L = collidingLines[0][1];
                

               
                
                const merkez1 = entity1.drawAttributes.location;
                const merkez2 = entity2.drawAttributes.location;
                
                const yaricap1 = collidePoint.copy().subtract(merkez1);
                const yaricap2 = collidePoint.copy().subtract(merkez2);
                const v1 = entity1.motionAttributes.velocity.copy().add(yaricap1.copy().multiply(entity1.motionAttributes.angularVelocity));
                const v2 = entity2.motionAttributes.velocity.copy().add(yaricap2.copy().multiply(entity2.motionAttributes.angularVelocity));
                const goreceliHiz = v2.copy().subtract(v1);

                const n1 = e1L.copy().rotateLine(entity1.drawAttributes.angle).normalVector();
                const n2 = e2L.copy().rotateLine(entity2.drawAttributes.angle).normalVector();

                const n1Dot = goreceliHiz.copy().normalize().dot(n1);
                const n2Dot = goreceliHiz.copy().normalize().dot(n2);
                let carpismaNormali = n1Dot > n2Dot ? n2 : n1;
                


                const normalUzerindekiHiz = carpismaNormali.copy().dot(goreceliHiz);

                const normalCrossY1 = carpismaNormali.copy().crossProduct(yaricap1);
                const normalCrossY2 = carpismaNormali.copy().crossProduct(yaricap2);

                let denom = (1 / entity1.motionAttributes.mass) + (1 / entity2.motionAttributes.mass) + 
                            (normalCrossY1 ** 2) / entity1.motionAttributes.momentOfInertia +
                            (normalCrossY2 ** 2) / entity2.motionAttributes.momentOfInertia;

                const e = 0.1 // carpisma enerji korunumu
                let j = -(1 + e) * normalUzerindekiHiz / denom;

                let impulse = carpismaNormali.copy().multiply(j);

                // hiz degisimi
                entity1.motionAttributes.velocity.subtract(impulse.copy().multiply((1 / entity1.motionAttributes.mass)));
                entity2.motionAttributes.velocity.add(impulse.copy().multiply((1 / entity2.motionAttributes.mass)));

                //tork degisimi
                entity1.motionAttributes.angularVelocity -= yaricap1.crossProduct(impulse) / entity1.motionAttributes.momentOfInertia;
                entity2.motionAttributes.angularVelocity += yaricap2.crossProduct(impulse) / entity2.motionAttributes.momentOfInertia;
                
                // for debugging

                Handler.showPoint(collidePoint);
                Handler.drawVector(yaricap1,merkez1)
                Handler.drawVector(yaricap2,merkez2)
                Handler.drawVector(carpismaNormali.copy().multiply(20),collidePoint,"green",6)
                Handler.drawVector(impulse.copy().multiply(50),collidePoint,"red",2);
        }

    }



    /**
     * @param {Entity} e1 
     * @param {Entity} e2 
     */
    #getCollidingLines(e1, e2) {
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

                const intersectPoint = e2L.getIntersectPoint(e1L);
                if (intersectPoint) {
                    array.push([e1.drawAttributes.shell.breakableLines[i], e2.drawAttributes.shell.breakableLines[j],intersectPoint]);
                }
            }
        }
        return array;
    }

    /**
     * @param {Bullet} bullet 
     * @param {Entity} entity 
     * @param {BreakableLine} collidingBulletLine 
     * @param {BreakableLine} collidingEntityLine 
     */
    #updateEntityWithBulletCollision(bullet,entity,collidingBulletLine,collidingEntityLine){
        const collisionSpeedMagnitude = bullet.motionAttributes.velocity.copy().subtract(entity.motionAttributes.velocity).magnitude();
        const durabilityRate = collidingEntityLine.durability / collidingBulletLine.durability;

        // pek bir matematik yok sadece orantı yazdım 
        const entityHealthAfterCollision = collidingEntityLine.health - collisionSpeedMagnitude * bullet.damage   / durabilityRate;
        const bulletHealthAfterCollision = collidingBulletLine.health - collisionSpeedMagnitude * durabilityRate;
        
        collidingEntityLine.health = entityHealthAfterCollision;
        collidingBulletLine.health = bulletHealthAfterCollision;

        if(collidingEntityLine.health <= 0) EntityTerminater.deadEntitiesQueue.push(entity);
        if(collidingBulletLine.health <= 0) EntityTerminater.deadEntitiesQueue.push(bullet);
    }

    /**
     * SAT teoremi ile ayırma işlemi yapar
     * @param {Entity} entity1
     * @param {Entity} entity2
     */
    #resolvePenetration(entity1,entity2) {
        const poly1 = new Polygon(entity1.drawAttributes.shell.breakableLines)
        const poly2 = new Polygon(entity2.drawAttributes.shell.breakableLines)
        const angle1 = entity1.drawAttributes.angle;
        const angle2 = entity2.drawAttributes.angle;
        const pos1 = entity1.drawAttributes.location;
        const pos2 = entity2.drawAttributes.location;
        const mass1 = entity1.motionAttributes.mass;
        const mass2 = entity2.motionAttributes.mass;

        const axes = this.#getNormals(poly1, angle1).concat(this.#getNormals(poly2, angle2));
        let minOverlap = Infinity;
        let smallestAxis = null;

        for (const axis of axes) {
            const proj1 = this.#projectPolygon(poly1, axis, pos1, angle1);
            const proj2 = this.#projectPolygon(poly2, axis, pos2, angle2);

            const overlap = this.#getOverlap(proj1, proj2);
            if (overlap === 0) return; // Ayrı eksen bulunduysa çarpışma yok

            if (overlap < minOverlap) {
                minOverlap = overlap;
                smallestAxis = axis.copy();
            }
        }
        const centerDelta = pos2.copy().subtract(pos1);
        if (centerDelta.dot(smallestAxis) < 0) {
            smallestAxis.multiply(-1);
        }
        const totalMass = mass1 + mass2;
        const correction = smallestAxis.normalize().multiply(minOverlap);

        pos1.subtract(correction.copy().multiply(mass2 / totalMass));
        pos2.add(correction.copy().multiply(mass1 / totalMass));
    }

    /**
     * @param {Polygon} poly
     * @returns {Vector[]}
     */
    #getNormals(poly, angle) {
        return poly.lines.map(line => {
            const rotatedLine = line.copy().rotateLine(angle);
            return rotatedLine.normalVector();
        });
    }
    
    

    /**
     * @param {Polygon} poly
     * @param {Vector} axis
     * @param {Vector} position
     * @returns {[number, number]}
     */
    #projectPolygon(poly, axis, position, angle) {
        let dots = [];
    
        for (let line of poly.lines) {
            const rotatedLine = line.copy().rotateLine(angle);
            const p1 = rotatedLine.startPoint.copy().add(position);
            const p2 = rotatedLine.endPoint.copy().add(position);
            dots.push(axis.dot(p1), axis.dot(p2));
        }
    
        return [Math.min(...dots), Math.max(...dots)];
    }
    
    

    /**
     * @param {[number, number]} proj1
     * @param {[number, number]} proj2
     * @returns {number}
     */
    #getOverlap([min1, max1], [min2, max2]) {
        return Math.max(0, Math.min(max1, max2) - Math.max(min1, min2));
    }

}


    


    
