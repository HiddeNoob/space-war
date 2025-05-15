// Oyun arka planı için statik ve çarpışmayan objeler oluşturan yardımcı sınıf
class BackgroundCreator extends Handler {
    /**
     * Statik ve çarpışmayan arka plan objeleri oluşturur
     * @param {Entity[]} objects - Eklenecek objeler
     */
    static createBackgroundObjects(objects) {

    }

    /**
     * Update function for background handler (can be used for background animation, parallax, etc.)
     */
    update = () => {


    }
}

// Örnek kullanım:
// BackgroundCreator.createBackgroundObjects(grid, [
//   { polygon: ShapeFactory.createRegularPolygon(6, 80), location: new Vector(300, 300) },
//   { polygon: ShapeFactory.createRectangle(200, 40), location: new Vector(600, 200), angle: Math.PI/4 },
// ]);
