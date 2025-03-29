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
        for(let i = 0; i < polygon.lines.length; i++){
            const currentLine = polygon.lines[i]
            let point1 = currentLine.startPoint.add(startPoint);
            let point2 = currentLine.endPoint.add(startPoint);

            ctx.lineWidth = currentLine.lineWidth;
            ctx.strokeStyle = currentLine.lineColor;

            ctx.moveTo(point1.getX(),point1.getY());
            ctx.lineTo(point2.getX(),point2.getY());
            ctx.stroke();
        }
    }
}