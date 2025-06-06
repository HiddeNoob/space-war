// Bir entity'nin çizimle ilgili tüm özelliklerini (konum, açı, renk, kabuk) tutan sınıf
class DrawAttributes {
    static calculatedTimestamp = 0; // Son hesaplanan zaman
    static calculatedShells = new Map(); // Ön belleğe alınmış shell'ler

    location; // Entity'nin konumu
    shell; // Entity'nin kabuğu (Polygon)
    angle; // Entity'nin açısı

    /**
     * DrawAttributes oluşturucu
     * @param {EntityShell} shell - Entity'nin şekli
     * @param {Vector} location - Başlangıç konumu
     * @param {number} angle - Başlangıç açısı
     * @param {string} color - Renk
     */
    constructor(shell = ShapeFactory.polygonToShell(GlobalShapes.TRIANGLE,10,100), location = new Vector(50, 50), angle = 0, color = "#ffffff") { 
        // !!! TODO garip bir şekilde locationu x = 0 y = 0 olarak initial yaparsam fizik motoru bozuluyor ?
        this.location = location;
        this.shell = shell;
        this.angle = angle;
        this.color = color;
    }
    
    /**
     * Çizim özelliklerinin kopyasını oluşturur
     * @returns {DrawAttributes}
     */
    copy() {
        return new DrawAttributes(
            this.shell.copy(),
            this.location.copy(),
            this.angle,
            this.color
        );
    }

    /**
     * Shell'i gerçek konumuna ve açısına göre döndürür ve taşır.
     * Eğer shell daha önce hesaplandıysa, önbellekten alır.
     * @returns {EntityShell}
     */
    getActualShell(){
        if(global.latestPaintTimestamp != DrawAttributes.calculatedTimestamp)
            DrawAttributes.calculatedShells = new Map();
        if(DrawAttributes.calculatedShells.has(this))
            return DrawAttributes.calculatedShells.get(this);
        else{
            const calculated = this.shell.copy().rotate(this.angle).move(this.location)
            DrawAttributes.calculatedShells.set(this,calculated);
            return calculated;
        }
    }
}
