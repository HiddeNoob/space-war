class Entity{
    /** @type {number} */
    health
    /** @type {MotionAttributes} */
    motionAttributes
    /** @type {DrawAttributes} */
    drawAttributes
    /**
     * @param {number} health 
     * @param {DrawAttributes} drawAttributes
     */
    constructor(health = 100,drawAttributes = new DrawAttributes(GlobalShapes.RECTANGLE),motionAttributes = new MotionAttributes()){
        this.drawAttributes = drawAttributes;
        this.motionAttributes = motionAttributes;
        this.health = health;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx){
        this.#drawPolygon(ctx,this.drawAttributes.polygon,this.drawAttributes.location);
    }
    
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Polygon} polygon
     * @param {Point} startPoint
     */
    #drawPolygon(ctx,polygon,startPoint){
        ctx.translate(startPoint.x,startPoint.y);
        ctx.rotate(this.drawAttributes.angle)
        ctx.beginPath();
            for(let i = 0; i < polygon.lines.length; i++){
            const currentLine = polygon.lines[i]
            
            let point1 = currentLine.startPoint
            let point2 = currentLine.endPoint

            ctx.lineWidth = currentLine.lineWidth;
            ctx.strokeStyle = currentLine.lineColor;
                
            ctx.moveTo(Math.floor(point1.x),Math.floor(point1.y)); // Math.floor for optimization
            ctx.lineTo(Math.floor(point2.x),Math.floor(point2.y)); // see the link for details https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#avoid_floating-point_coordinates_and_use_integers_instead

        }
        ctx.stroke();
        ctx.rotate(-this.drawAttributes.angle);
        ctx.translate(-startPoint.x,-startPoint.y);
    }

}