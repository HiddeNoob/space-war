class Bullet extends Entity{
    /**
     * @param {number} durability 
     * @param {DrawAttributes} drawOptions
     */
    constructor(durability,drawOptions){
        drawOptions ? super(5,drawOptions) : super(5);
    }
}