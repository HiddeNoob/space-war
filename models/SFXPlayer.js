class SoundEffect{
    /**
     * @param {string} src - Ses kaynağı
     * @param {number} dxMultiplier - Sesin inital çarpanı
     * @param {boolean} loop - Sesin döngüde çalıp çalmayacağı
     */
    constructor(src,dxMultiplier = 0.1,loop = false){
        this.src = src;
        this.audio = new Audio(this.src);
        this.audio.loop = loop;
        this.dxMultiplier = dxMultiplier;
        this.setVolume(Settings.default.volume);
    }

    /**
     * @param {number} volume 1 - 100 arasında ses seviyesi 
     */
    setVolume(volume){
        this.audio.volume = volume * this.dxMultiplier / 100;
    }

    play(){
        if(this.audio.loop){
            this.audio.paused && this.audio.play();
            return;
        }else{
            if(!this.audio.ended){ // ses bitmemişse echo yapmak için yeni ses oluşturdum
                
                const copy = new Audio(this.src); 
                copy.volume = this.audio.volume;
                copy.play();
                return;
            }
            this.audio.currentTime = 0;
            this.audio.play();
        }


    }

    pause(){
        this.audio.pause();
    }
}

class SFXPlayer{
    static sfxs = {
        "health-recharge": new SoundEffect("./assets/audios/undertale_health-recharge.wav"),
        "menu-change": new SoundEffect("./assets/audios/undertale_menu-change.mp3"),
        "menu-discard": new SoundEffect("./assets/audios/undertale_menu-return.wav"),
        "menu-select": new SoundEffect("./assets/audios/undertale_menu-select.wav"),
        "shot": new SoundEffect("./assets/audios/undertale_shot.wav"),
        "explosion": new SoundEffect("./assets/audios/undertale_impact.wav",0.08),
        "coin-catch": new SoundEffect("./assets/audios/undertale_coin.wav",0.08),
        "hurt": new SoundEffect("./assets/audios/undertale_hurt.wav"),
        "spawner-appear": new SoundEffect("./assets/audios/undertale_spawner-appear.wav"),
        "speed-up": new SoundEffect("./assets/audios/undertale_speed-up.wav"),
        "background": new SoundEffect("./assets/audios/hopes_and_dreams.mp3",0.1,true),
    }

    /**
     * @param {number} volume 1 - 100 arasında ses seviyesi
     */
    static setAllEffectVolumes(volume){
        for(const sfxName in SFXPlayer.sfxs){
            const sfx = SFXPlayer.sfxs[sfxName];
            sfx.setVolume(volume);
        }
    }
}
