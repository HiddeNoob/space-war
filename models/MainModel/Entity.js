class Entity{
    /** @type {MotionAttributes} */
    motionAttributes
    /** @type {DrawAttributes} */
    drawAttributes
    /** @type {boolean} */
    isStatic = false;
    /** @type {boolean} */
    isAlive = true
    /** @type {boolean} */
    canCollide = true;
    /**
     * @param {DrawAttributes} drawAttributes
     */
    constructor(drawAttributes = new DrawAttributes(GlobalShapes.RECTANGLE),motionAttributes = new MotionAttributes()){
        this.drawAttributes = drawAttributes;
        this.motionAttributes = motionAttributes;
        this.drawAttributes.shell.lines.forEach((line) => line.belongsTo = this);
        this.#calculateAttributes();
        console.log(this);
    }

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

    /** @param {Entity} entity */
    isCollidingWith(entity){
        const e1L = this.drawAttributes.shell.lines;
        const e2L = entity.drawAttributes.shell.lines;

        for(let line1 of e1L){
            for(let line2 of e2L){
                line1 = line1.copy().rotateLine(this.drawAttributes.angle).moveLine(this.drawAttributes.location.x,this.drawAttributes.location.y);
                line2 = line2.copy().rotateLine(entity.drawAttributes.angle).moveLine(entity.drawAttributes.location.x,entity.drawAttributes.location.y);
                const point = line1.getIntersectPoint(line2);
                if(point) return true;
            }
        }
        return false;
    }

}