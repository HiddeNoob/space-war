class CollisionHandler extends Handler {

    static lineGridCellSize = Settings.default.gridLineCellSize;

    /**
     * @param {Grid} grid
     * @param {Player} player
     */
    constructor(grid,player){
        super(grid,player);
    }

    update = () => {

        this.grid.applyToCloseEntityPairs((entity1, entity2) => {
            if (!(entity1.canCollide && entity2.canCollide)) return;

            this.#makeCollisions(entity1, entity2);
            this.#resolvePenetration(entity1, entity2);
        });

    };

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
                const acisal1 = yaricap1.copy().multiply(entity1.motionAttributes.angularVelocity).rotate(Math.PI / 2); // acisal hiz cross carpım yapılıp yaricapa dik olarak eklenmeli
                const acisal2 = yaricap2.copy().multiply(entity2.motionAttributes.angularVelocity).rotate(Math.PI / 2);
                const v1 = entity1.motionAttributes.velocity.copy().add(acisal1);
                const v2 = entity2.motionAttributes.velocity.copy().add(acisal2);
                const goreceliHiz = v2.copy().subtract(v1);

                const n1 = e1L.normalVector();
                const n2 = e2L.normalVector();

                const n1Dot = goreceliHiz.copy().normalize().dot(n1);
                const n2Dot = goreceliHiz.copy().normalize().dot(n2);
                let carpismaNormali = Math.abs(n1Dot) > Math.abs(n2Dot) ? n1 : n2; // hangi normal daha büyükse o normal kullanılır

                


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
        for (let i = 0; i < e1.drawAttributes.shell.lines.length; i++) {
            let e1L = e1.drawAttributes.shell.lines[i]
                .copy()
                .rotateLine(e1.drawAttributes.angle)
                .moveLine(e1.drawAttributes.location.x, e1.drawAttributes.location.y);
            for (let j = 0; j < e2.drawAttributes.shell.lines.length; j++) {
                let e2L = e2.drawAttributes.shell.lines[j]
                    .copy()
                    .rotateLine(e2.drawAttributes.angle)
                    .moveLine(e2.drawAttributes.location.x, e2.drawAttributes.location.y);

                const intersectPoint = e2L.getIntersectPoint(e1L);
                if (intersectPoint) {
                    array.push([e1.drawAttributes.shell.lines[i], e2.drawAttributes.shell.lines[j],intersectPoint]);
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

    static isPolygonsPenetrating(poly1,poly2){
        const axes = poly1.getNormals().concat(poly2.getNormals());
        for (const axis of axes) {
            const proj1 = CollisionHandler.#projectPolygon(poly1, axis);
            const proj2 = CollisionHandler.#projectPolygon(poly2, axis);
            const overlap = CollisionHandler.#getOverlap(proj1, proj2);
            if (overlap === 0) return false;
        }
        return true;
    }

    /**
     * SAT teoremi ile ayırma işlemi yapar
     * @param {Entity} entity1
     * @param {Entity} entity2
     */
    #resolvePenetration(entity1,entity2) {
        const poly1 = entity1.drawAttributes.getActualShell();
        const poly2 = entity2.drawAttributes.getActualShell();
        const pos1 = entity1.drawAttributes.location;
        const pos2 = entity2.drawAttributes.location;
        const mass1 = entity1.motionAttributes.mass;
        const mass2 = entity2.motionAttributes.mass;

        const axes = poly1.getNormals().concat(poly2.getNormals());
        let minOverlap = Infinity;
        let smallestAxis = null;
        for (const axis of axes) {
            const proj1 = CollisionHandler.#projectPolygon(poly1, axis);
            const proj2 = CollisionHandler.#projectPolygon(poly2, axis);

            const overlap = CollisionHandler.#getOverlap(proj1, proj2);
            if (overlap === 0) return; // Ayrı eksen bulunduysa çarpışma yok

            if (overlap < minOverlap) {
                minOverlap = overlap;
                smallestAxis = axis;
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
     * @param {Vector} axis
     * @returns {[number, number]}
     */
    static #projectPolygon(poly, axis) {
        let dots = [];
    
        for (let line of poly.lines) {
            const p1 = line.startPoint;
            const p2 = line.endPoint;
            dots.push(axis.dot(p1), axis.dot(p2));
        }
    
        return [Math.min(...dots), Math.max(...dots)];
    }
    
    

    /**
     * @param {[number, number]} proj1
     * @param {[number, number]} proj2
     * @returns {number}
     */
    static #getOverlap([min1, max1], [min2, max2]) {
        return Math.max(0, Math.min(max1, max2) - Math.max(min1, min2));
    }

}






