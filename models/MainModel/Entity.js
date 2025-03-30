class Entity{
    /** @type {number} */
    health

    /**
     * @param {number} health 
     * @param {DrawAttributes} drawOptions
     */
    constructor(health = 100,drawOptions = EntityShapes.PLAYER_PAINT_OPTIONS){
        this.drawOptions = drawOptions;
        this.health = health;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx){
        this.#drawPolygon(ctx,this.drawOptions.polygon,this.drawOptions.location);
    }
    
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Polygon} polygon
     * @param {Point} startPoint
     */
    #drawPolygon(ctx,polygon,startPoint){
        ctx.fillText(this.drawOptions.angle.toString(),10,200)
        ctx.translate(startPoint.x,startPoint.y);
        ctx.rotate(this.drawOptions.angle)
        ctx.beginPath();
        ctx.arc(0,0,10,0,360)
        for(let i = 0; i < polygon.lines.length; i++){
            const currentLine = polygon.lines[i]
            
            let point1 = currentLine.startPoint
            let point2 = currentLine.endPoint

            ctx.lineWidth = currentLine.lineWidth;
            ctx.strokeStyle = currentLine.lineColor;

            ctx.moveTo(point1.x,point1.y);
            ctx.lineTo(point2.x,point2.y);
        }
        ctx.stroke();
        ctx.rotate(-this.drawOptions.angle);
        ctx.translate(-startPoint.x,-startPoint.y);
    }
}