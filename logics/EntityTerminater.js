class EntityTerminater extends Handler{
    /** @type {Entity[]} */
    static deadEntitiesQueue = []
    
    /**
     * @param {Grid} grid
     * @param {Player} player
     */
    constructor(grid,player){
        super(grid,player);
    }

    update = () => {
        this.#processDeadEntites();
    }

    #processDeadEntites(){
        while(EntityTerminater.deadEntitiesQueue.length > 0){ // baya kötü bu düzeltilmesi lazım TODO
            /** @type {Entity} */
            const deadEntity = EntityTerminater.deadEntitiesQueue.pop();
            deadEntity.isAlive = false;

            const entitySpeedVector = deadEntity.motionAttributes.velocity;
            const bodyPartCount = deadEntity.drawAttributes.shell.breakableLines.length;
            const unitVector = new Vector(1,0); // for not creating every iteration

            for(let i = 0; i < bodyPartCount ; i++){ // making explosin animation
                const selectedLine = deadEntity.drawAttributes.shell.breakableLines[i];
                if(selectedLine.health <= 0) continue;
                const angle = i * (2 * Math.PI) / bodyPartCount;
                const location = deadEntity.drawAttributes.location;
                const lineLocation = location.add(selectedLine.centerPoint());
                const speed = (unitVector.copy().rotate(angle).add(entitySpeedVector));
                const motionAttributes = new MotionAttributes();
                const drawAttributes = new DrawAttributes(new Polygon([selectedLine]),lineLocation);
                motionAttributes.velocity = speed;
                this.grid.addEntity(new Entity(drawAttributes,motionAttributes));
            }

        }
    }
}