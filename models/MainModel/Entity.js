// Oyun içindeki tüm varlıkların (entity) temelini oluşturan ana sınıf
class Entity{
    /** @type {MotionAttributes} */
    motionAttributes // Fiziksel özellikler
    /** @type {DrawAttributes} */
    drawAttributes // Çizim özellikleri
    /** @type {boolean} */
    isStatic = false; // Statik mi?
    /** @type {boolean} */
    isAlive = true // Canlı mı?
    /** @type {boolean} */
    canCollide = true; // Çarpışabilir mi?
    /**
     * Entity oluşturucu
     * @param {DrawAttributes} drawAttributes - Çizim özellikleri
     * @param {MotionAttributes} motionAttributes - Fiziksel özellikler
     */
    constructor(drawAttributes = new DrawAttributes(GlobalShapes.RECTANGLE),motionAttributes = new MotionAttributes()){
        this.drawAttributes = drawAttributes;
        this.motionAttributes = motionAttributes;
        this.drawAttributes.shell.lines.forEach((line) => line.belongsTo = this);
        this.#calculateAttributes();
    }

    /**
     * Alan ve atalet momenti gibi fiziksel özellikleri hesaplar
     */
    #calculateAttributes(){
        const motion = this.motionAttributes;
        const draw = this.drawAttributes;
        const center = this.drawAttributes.location
        let total = 0;
        for(let line of draw.shell.lines){
            total += (line.startPoint.x*line.endPoint.y - line.endPoint.x*line.startPoint.y);
        }
        Math.abs(total);
        total *= 1 / 2;
        motion.mass = total;
        motion.momentOfInertia = 0;
        for(let line of draw.shell.lines){
            let distance = center.distanceTo(line.centerPoint())
            motion.momentOfInertia += (distance**2) * (motion.mass / draw.shell.lines.length);
        }
        motion.momentOfInertia *= 1e-2
    }

    /**
     * İki entity'nin kabuk çizgileri arasında çarpışma olup olmadığını kontrol eder
     * @param {Entity} entity
     * @returns {boolean}
     */
    isCollidingWith(entity){
        const e1L = this.drawAttributes.shell.lines;
        const e2L = entity.drawAttributes.shell.lines;
        for(let line1 of e1L){
            for(let line2 of e2L){
                // @ts-ignore
                line1 = line1.copy().rotateLine(this.drawAttributes.angle).moveLine(this.drawAttributes.location.x,this.drawAttributes.location.y);
                // @ts-ignore
                line2 = line2.copy().rotateLine(entity.drawAttributes.angle).moveLine(entity.drawAttributes.location.x,entity.drawAttributes.location.y);
                const point = line1.getIntersectPoint(line2);
                if(point) return true;
            }
        }
        return false;
    }

    /**
     * Entity'yi verilen vektör kadar taşır
     * @param {Vector} dVector
     */
    move(dVector) {
        this.drawAttributes.location.add(dVector);
    }
    
    /**
     * Entity'yi verilen konuma taşır
     * @param {Vector} vector
     */
    moveTo(vector) {
        this.drawAttributes.location = vector.copy();
    }
    
    /**
     * Entity'yi verilen açı kadar döndürür
     * @param {number} angle
     */
    rotate(angle) {
        this.drawAttributes.angle += angle;
    }

    /**
     * Entity'yi verilen vektöre doğru döndürür
     * @param {Vector} vector
     */
    rotateTo(vector) {
        const direction = vector.copy().subtract(this.drawAttributes.location);
        this.drawAttributes.angle = direction.angle();
    }
}