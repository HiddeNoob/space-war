class SoundEffect{
    static bufferCache = new Map();
    static audioContext = new AudioContext();

    /**
     * @param {string} src - Ses kaynağı
     * @param {number} dxMultiplier - Sesin inital çarpanı
     * @param {boolean} loop - Sesin döngüde çalıp çalmayacağı
     */
    constructor(src,dxMultiplier = 0.1,loop = false){
        this.loop = loop;
        this.dxMultiplier = dxMultiplier;
        this.buffer = null;
        this.sourceNode = null;
        this.startedAt = 0;
        this.pausedAt = 0;
        this.isPlaying = false;
        this.volume = Settings.default.volume * dxMultiplier / 100;
        this.gainNode = SoundEffect.audioContext.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(SoundEffect.audioContext.destination);
        this.bufferReady = SoundEffect.loadBuffer(src).then(/** @param {AudioBuffer} buffer */ (buffer) => {
            this.buffer = buffer;
            return buffer;
        });
    }

    /** @param {string} src @returns {Promise<AudioBuffer>} */
    static loadBuffer(src){
        if(!SoundEffect.bufferCache.has(src)){
            const bufferPromise = fetch(src)
                .then((response) => response.arrayBuffer())
                .then((audioData) => SoundEffect.audioContext.decodeAudioData(audioData));
            SoundEffect.bufferCache.set(src, bufferPromise);
        }
        return SoundEffect.bufferCache.get(src);
    }

    /**
     * @param {number} volume 1 - 100 arasında ses seviyesi
     */
    setVolume(volume){
        this.volume = volume * this.dxMultiplier / 100;
        this.gainNode.gain.value = this.volume;
    }

    play(){
        SoundEffect.audioContext.resume();
        if(!this.buffer){
            this.bufferReady.then(() => this.play());
            return;
        }
        if(this.loop && this.isPlaying){
            return;
        }

        const sourceNode = SoundEffect.audioContext.createBufferSource();
        sourceNode.buffer = this.buffer;
        sourceNode.loop = this.loop;
        sourceNode.connect(this.gainNode);
        sourceNode.onended = () => {
            if(sourceNode === this.sourceNode && !this.loop){
                this.isPlaying = false;
                this.pausedAt = 0;
            }
        };
        const offset = this.loop ? this.pausedAt % this.buffer.duration : 0;
        sourceNode.start(0, offset);
        this.sourceNode = sourceNode;
        this.startedAt = SoundEffect.audioContext.currentTime - offset;
        this.isPlaying = true;
    }

    pause(){
        if(!this.isPlaying || !this.sourceNode){
            return;
        }
        this.pausedAt = SoundEffect.audioContext.currentTime - this.startedAt;
        this.sourceNode.stop();
        this.sourceNode = null;
        this.isPlaying = false;
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
        "death-menu": new SoundEffect("./assets/audios/death.mp3",0.1,true),
    }

    /**
     * @param {number} volume 1 - 100 arasında ses seviyesi
     */
    static setAllEffectVolumes(volume){
        /** @type {Object.<string, SoundEffect>} */
        const effects = SFXPlayer.sfxs;
        for(const sfxName in effects){
            effects[sfxName].setVolume(volume);
        }
    }
}
