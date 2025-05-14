class SoundEffect{
    /**
     * @param {string} src - Ses kaynağı
     */
    constructor(src,dxMultiplier = 1){
        this.src = src;
        this.audio = new Audio(this.src);
        this.audio.volume = dxMultiplier * (Settings.default.volume / 100);
        this.audio.loop = false;
    }

    play(){
        if(!this.audio.ended){ // ses bitmemişse echo yapmak için yeni ses oluşturdum
            const copy = new Audio(this.src); 
            copy.volume = this.audio.volume;
            copy.play();
            return;
        }
        this.audio.currentTime = 0;
        this.audio.play();
    }

    stop(){
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
        "explosion": new SoundEffect("./assets/audios/undertale_impact.wav",1/2),
        "coin-catch": new SoundEffect("./assets/audios/undertale_coin.wav",3/4),
        "hurt": new SoundEffect("./assets/audios/undertale_hurt.wav"),
        "spawner-appear": new SoundEffect("./assets/audios/undertale_spawner-appear.wav"),
        "speed-up": new SoundEffect("./assets/audios/undertale_speed-up.wav"),
    }

    /**
     * @param {number} volume 
     */
    static setVolume(volume){
        for(const sfxName in SFXPlayer.sfxs){
            const sfx = SFXPlayer.sfxs[sfxName];
            sfx.audio.volume = volume;
        }
    }
}
