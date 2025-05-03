// Oyun içi handler'ların temelini oluşturan soyut sınıf
class Handler{
    /** @type {CallableFunction} */
    update = () => {}; // Her handler'ın güncelleme fonksiyonu

    /** @type {CallableFunction} */
    init = () => {}; // Her handler'ın başlatma fonksiyonu

    /** @type {Grid} */
    grid // Oyun grid'i

    /** @type {Player} */
    player // Oyuncu

    /** @type {Camera} */
    camera

    /**
     * Handler oluşturucu
     * @param {Grid} grid - Oyun grid'i
     * @param {Player} player - Oyuncu
     */
    constructor(grid,player,camera){
        this.grid = grid;
        this.player = player;
        this.camera = camera;
    }


}