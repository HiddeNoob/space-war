// Oyun içi çarpışma ve penetrasyon işlemlerini yöneten handler sınıfı
class CollisionHandler extends Handler {

    /**
     * Ekranda görünen hücrelerde çarpışma ve penetrasyon kontrolü yapar
     */
    update = () => {
        // Sadece ekranda görünen hücrelerde çarpışma kontrolü
        this.grid.applyToVisibleEntityPairs(
            (entity1, entity2) => {
                if (!(entity1.canCollide && entity2.canCollide)) return;
                this.#makeCollisions(entity1, entity2);
                this.#resolvePenetration(entity1, entity2);
            },
            this.camera
        );
    };

    /**
     * İki entity arasında çarpışma ve fiziksel tepkiyi uygular
     * @param {Entity} entity1
     * @param {Entity} entity2
     */
    #makeCollisions(entity1,entity2) {
        const collidingLines = this.#getCollidingLines(entity1, entity2);
        if (collidingLines.length > 0) {
            /** @type {Vector} */
            const collidePoint = new Vector();
            collidingLines.forEach((array) => {
                Debugger.showPoint(array[2]);
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
            const acisal1 = yaricap1.copy().multiply(entity1.motionAttributes.angularVelocity).rotate(Math.PI / 2); // açısal hız cross çarpım yapılıp yarıçapa dik olarak eklenmeli
            const acisal2 = yaricap2.copy().multiply(entity2.motionAttributes.angularVelocity).rotate(Math.PI / 2);
            const v1 = entity1.motionAttributes.velocity.copy().add(acisal1);
            const v2 = entity2.motionAttributes.velocity.copy().add(acisal2);
            const goreceliHiz = v2.copy().subtract(v1);

            // normal seçiminde hala kararsızım
            const n1 = e1L.normalVector();
            const n2 = e2L.normalVector();
            const n1Dot = goreceliHiz.dot(n1);
            const n2Dot = goreceliHiz.dot(n2);

            let carpismaNormali = Math.abs(n1Dot) > Math.abs(n2Dot) ? n1 : n2; 

            const normalUzerindekiHiz = carpismaNormali.copy().dot(goreceliHiz);
            const normalCrossY1 = carpismaNormali.copy().crossProduct(yaricap1);
            const normalCrossY2 = carpismaNormali.copy().crossProduct(yaricap2);
            let denom = (1 / entity1.motionAttributes.mass) + (1 / entity2.motionAttributes.mass) + 
                        (normalCrossY1 ** 2) / entity1.motionAttributes.momentOfInertia +
                        (normalCrossY2 ** 2) / entity2.motionAttributes.momentOfInertia;
            const e = 0.1 // çarpışma enerji korunumu katsayısı
            let j = -(1 + e) * normalUzerindekiHiz / denom;
            let impulse = carpismaNormali.copy().multiply(j);
            // hız değişimi
            if(!entity1.isStatic){
                entity1.motionAttributes.velocity.subtract(impulse.copy().multiply((1 / entity1.motionAttributes.mass)));
                entity1.motionAttributes.angularVelocity -= yaricap1.crossProduct(impulse) / entity1.motionAttributes.momentOfInertia;
            }
            if(!entity2.isStatic){
                entity2.motionAttributes.velocity.add(impulse.copy().multiply((1 / entity2.motionAttributes.mass)));
                entity2.motionAttributes.angularVelocity += yaricap2.crossProduct(impulse) / entity2.motionAttributes.momentOfInertia;
            }
            // Debug çizimleri
            Debugger.showPoint(collidePoint);
            Debugger.drawVector(yaricap1,merkez1)
            Debugger.drawVector(yaricap2,merkez2)
            Debugger.drawVector(carpismaNormali.copy().multiply(5),collidePoint,"green",6)
            Debugger.drawVector(impulse.copy().multiply(5),collidePoint,"red",2);
        }
    }

    /**
     * İki entity'nin çarpışan çizgilerini bulur
     * @param {Entity} e1
     * @param {Entity} e2
     * @returns {Array[]} Çarpışan çizgi çiftleri ve kesişim noktası
     */
    #getCollidingLines(e1, e2) {
        const actualShell1 = e1.drawAttributes.getActualShell();
        const actualShell2 = e2.drawAttributes.getActualShell();
        const array = [];
        for (let i = 0; i < actualShell1.lines.length; i++) {
            let e1L = actualShell1.lines[i]
            for (let j = 0; j < actualShell2.lines.length; j++) {
                let e2L = actualShell2.lines[j]
                const intersectPoint = e2L.getIntersectPoint(e1L);
                if (intersectPoint) {
                    array.push([actualShell1.lines[i], actualShell2.lines[j],intersectPoint]);
                }
            }
        }
        return array;
    }

    /**
     * Mermi ve entity çarpışmasında sağlık günceller
     * @param {Bullet} bullet
     * @param {Entity} entity
     * @param {BreakableLine} collidingBulletLine
     * @param {BreakableLine} collidingEntityLine
     */
    #updateEntityWithBulletCollision(bullet,entity,collidingBulletLine,collidingEntityLine){
        const collisionSpeedMagnitude = bullet.motionAttributes.velocity.copy().subtract(entity.motionAttributes.velocity).magnitude();
        const durabilityRate = collidingEntityLine.durability / collidingBulletLine.durability;
        // Sadece orantı ile sağlık azaltılır
        const entityHealthAfterCollision = collidingEntityLine.health - collisionSpeedMagnitude * bullet.damage   / durabilityRate;
        const bulletHealthAfterCollision = collidingBulletLine.health - collisionSpeedMagnitude * durabilityRate;
        collidingEntityLine.health = entityHealthAfterCollision;
        collidingBulletLine.health = bulletHealthAfterCollision;
        if(collidingEntityLine.health <= 0) EntityTerminater.deadEntitiesQueue.push(entity);
        if(collidingBulletLine.health <= 0) EntityTerminater.deadEntitiesQueue.push(bullet);
    }

    /**
     * SAT teoremi ile iki entity arasındaki penetrasyonu çözer
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
        const result = poly1.minOverlapping(poly2);
        if (!result) return; // Çarpışma yok
        let { minOverlap, smallestAxis } = result;
        const centerDelta = pos2.copy().subtract(pos1);
        if (centerDelta.dot(smallestAxis) < 0) {
            smallestAxis.multiply(-1);
        }
        const totalMass = mass1 + mass2;
        const correction = smallestAxis.normalize().multiply(minOverlap);
        if(!entity1.isStatic){
            pos2.add(correction.copy().multiply(mass1 / totalMass));
        }
        if(!entity1.isStatic){
            pos1.subtract(correction.copy().multiply(mass2 / totalMass));
        }
    }
}