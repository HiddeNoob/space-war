class Coin extends Entity{
    value = 1;

    /**
     * @param {number} value
     * @param {DrawAttributes} drawAttributes 
     * @param {MotionAttributes} motionAttributes 
     */
    constructor(value,drawAttributes = new DrawAttributes(ShapeFactory.createRegularPolygon(8,20)),motionAttributes = new MotionAttributes()){
        super(drawAttributes,motionAttributes);
        this.value = value;
        this.motionAttributes.velocitySlowdownRate = 0.99
        this.canCollide = false;
    }

    static create(x,y,value = 1,size = 20){
        return new Coin(value,new DrawAttributes(ShapeFactory.createRegularPolygon(10,size),new Vector(x,y)))
    }
}