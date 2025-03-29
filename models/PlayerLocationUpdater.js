class PlayerLocationUpdater{
    /** @type {Player} */
    player;

    constructor(player){
        this.addEventListener()
        this.player = player;
    }

    addEventListener(){
        window.addEventListener("keypress",(e) => {
            if(e.key == "w"){
                this.onPressedUp(e);
            }else if(e.key == "s"){
                this.onPressedDown(e);
            }else if(e.key == "a"){
                this.onPressedLeft(e);
            }else if(e.key == "d"){
                this.onPressedRight(e);
            }
        })
        window.addEventListener("keyup",(e) => {
            if(e.key == "w"){
                this.onReleaseUp(e);
            }else if(e.key == "s"){
                this.onReleaseDown(e);
            }else if(e.key == "a"){
                this.onReleaseLeft(e);
            }else if(e.key == "d"){
                this.onReleaseRight(e);
            }
        })
    }

    onPressedUp(e){
        this.player.motion.acceleration.data[1] = this.player.accelerationPower;
    }
    
    onPressedDown(e) {
        this.player.motion.acceleration.data[1] = -this.player.accelerationPower;
    }
    
    onPressedLeft(e) {
        this.player.motion.acceleration.data[0] = -this.player.accelerationPower;
    }
    
    onPressedRight(e) {
        this.player.motion.acceleration.data[0] = this.player.accelerationPower;
    }
    
    onReleaseUp(e) {
        this.player.motion.acceleration.data[1] = 0;
    }
    
    onReleaseDown(e) {
        this.player.motion.acceleration.data[1] = 0;
    }
    
    onReleaseLeft(e) {
        this.player.motion.acceleration.data[0] = 0;
    }
    
    onReleaseRight(e) {
        this.player.motion.acceleration.data[0] = 0;
    }
    
}

