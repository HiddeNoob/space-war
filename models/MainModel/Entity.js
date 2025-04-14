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