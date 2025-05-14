// Oyun içindeki tüm varlıkların (entity) temelini oluşturan ana sınıf
class Entity{


    /** @type {((timestamp : number) => void)[]} */
    onDeconstruct = [] // Entity yok edildiğinde çağrılır

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
    constructor(drawAttributes = new DrawAttributes(),motionAttributes = new MotionAttributes()){
        this.drawAttributes = drawAttributes;
        this.motionAttributes = motionAttributes;
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
     * @param {Polygon} polygon
     */
    setPolygon(polygon){
        this.drawAttributes.shell = new EntityShell(polygon.lines.map(line => new BreakableLine(line)));
        this.#calculateAttributes();
        return this;
    }

    /**
     * @param {string} color
     * @returns {this}
    */
    setColor(color){
        this.drawAttributes.shell.setColor(color);
        return this;
    }

    /**
     * @param {Vector} location
     * @returns {this}
     */
    setLocation(location){
        this.drawAttributes.location = location;
        return this;
    }

    /**
     * Bütün çizgilerin şuanki canını ve maksimumum canını verilen değere eşitler
     * @param {number} health 
     * @returns {this}
     */
    setHealth(health){
        this.drawAttributes.shell.lines.forEach((line) => (line.health = health) && (line.maxHealth = health));
        return this;
    }

    /**
     * Bütün çizgilerin şuanki dayanıklılığını verilen değere eşitler
     * @param {number} durability 
     */
    setDurability(durability){
        this.drawAttributes.shell.lines.forEach((line) => line.durability = durability);
        return this;
    }

    /**
     * İki entity'nin kabuk çizgileri arasında çarpışma olup olmadığını kontrol eder
     * @param {Entity} entity
     * @returns {{line1: BreakableLine, line2: BreakableLine, point: Vector} | false}
     * @description Çarpışma varsa çarpışma çizgilerini ve çarpışma noktasını döner
     */
    isCollidingWith(entity){
        const e1L = this.drawAttributes.getActualShell().lines;
        const e2L = entity.drawAttributes.getActualShell().lines;
        for(let i = 0; i < e1L.length; i++){
            let line1 = e1L[i];
            for(let j = 0; j < e2L.length; j++){
                let line2 = e2L[j];
                const point = line1.getIntersectPoint(line2);
                if(point) return {
                    line1: this.drawAttributes.shell.lines[i],
                    line2: entity.drawAttributes.shell.lines[j],
                    point: point
                };
            }
        }
        return null;
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