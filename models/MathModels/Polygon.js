// Oyun içi çokgen (Polygon) şekillerini ve çarpışma kontrollerini yöneten ana sınıf
class Polygon {
    /** @type {Line[] | BreakableLine[]} */
    #lines; // Çokgeni oluşturan çizgiler

    /**
     * Polygon oluşturucu
     * @param {Line[]} lines - Çokgeni oluşturan çizgiler
     */
    constructor(lines) {
        this.#lines = lines;
        this.move(this.#getCenter().multiply(-1));
    }

    /**
     * Çokgenin çizgilerini döndürür
     */
    get lines() {
        return this.#lines;
    }

    /**
     * Çokgenin merkezini hesaplar
     * @returns {Vector}
     */
    #getCenter() {
        let center = new Vector(0, 0);
        for (let i = 0; i < this.#lines.length; i++) {
            center.add(this.#lines[i].startPoint);   
        }
        center.multiply(1 / this.#lines.length);
        return center;
    }
    
    /** 
     * Çokgeni ölçeklendirir
     * @param {number} size 
     * @returns {Polygon}
     */
    scaleBy(size) {
        this.#lines.forEach((line) => {
            line.startPoint.multiply(size);
            line.endPoint.multiply(size);
        });
        return this;
    }

    /**
     * Çokgenin tüm çizgilerinin rengini değiştirir
     * @param {string} color
     * @returns {Polygon}
     */
    setColor(color) {
        this.#lines.forEach((line) => line.lineColor = color);
        return this;
    }

    /**
     * Çokgeni verilen vektöre taşır
     * @param {Vector} vector 
     */
    move(vector) {
        this.#lines.forEach((line) => line.moveLine(vector.x, vector.y));
        return this;
    }

    /**
     * Çokgeni verilen açı kadar döndürür
     * @param {number} angle
     */
    rotate(angle) {
        const center = this.#getCenter();
        this.#lines.forEach((line) => line.rotateLine(angle, center));
        return this;
    }

    /**
     * Çokgenin kopyasını oluşturur
     * @returns {Polygon}
     */
    copy() {
        return new Polygon(this.#lines.map((line) => line.copy()));
    }

    /**
     * Çokgenin maksimum ve minimum noktalarını döndürür
     * @returns {{maxX:number,minX:number,maxY:number,minY:number}}
     */
    getMaxPoints() {
        const points = {
            maxX: -Infinity,
            minX: Infinity,
            maxY: -Infinity,
            minY: Infinity
        };
        this.#lines.forEach((line) => {
            const x1 = line.startPoint.x;
            const y1 = line.startPoint.y;
            const x2 = line.endPoint.x;
            const y2 = line.endPoint.y;

            points.maxX = Math.max(points.maxX, x1, x2);
            points.maxY = Math.max(points.maxY, y1, y2);
            points.minX = Math.min(points.minX, x1, x2);
            points.minY = Math.min(points.minY, y1, y2);
        });
        return points;
    }
    
    /**
     * Çokgenin normal vektörlerini döndürür
     * @returns {Vector[]}
    */
    getNormals() {
        return this.#lines.map(line => line.normalVector(this.#getCenter()));
    }

    /**
     * İki poligon arasında en küçük çakışmayı bulur.
     * Çakışma eksenini ve çakışma miktarını döner.
     * @param {Polygon} other
     * @returns {{minOverlap: number, smallestAxis: Vector} | null}
     */
    minOverlapping(other) {
        const axes = this.getNormals().concat(other.getNormals());
        let minOverlap = Infinity;
        let smallestAxis = null;
        for (const axis of axes) {
            const proj1 = Polygon.#projectPolygon(this, axis);
            const proj2 = Polygon.#projectPolygon(other, axis);
            const overlap = Polygon.#getOverlap(proj1, proj2);
            if (overlap === 0) return null; // Çakışma yok
            if (overlap < minOverlap) {
                minOverlap = overlap;
                smallestAxis = axis;
            }
        }
        return { minOverlap, smallestAxis };
    }

    /**
     * SAT ile iki çokgenin çakışıp çakışmadığını kontrol eder
     * @param {Polygon} other
     * @returns {boolean}
     */
    isPenetrating(other) {
        const axes = this.getNormals().concat(other.getNormals());
        for (const axis of axes) {
            const proj1 = Polygon.#projectPolygon(this, axis);
            const proj2 = Polygon.#projectPolygon(other, axis);
            const overlap = Polygon.#getOverlap(proj1, proj2);
            if (overlap === 0) return false;
        }
        return true;
    }

    /**
     * Çokgenin bir eksene izdüşümünü alır
     * @param {Polygon} poly
     * @param {Vector} axis
     * @returns {[number, number]}
     */
    static #projectPolygon(poly, axis) {
        let dots = [];
        for (let line of poly.lines) {
            const p1 = line.startPoint;
            const p2 = line.endPoint;
            dots.push(axis.dot(p1), axis.dot(p2));
        }
        return [Math.min(...dots), Math.max(...dots)];
    }

    /**
     * İki izdüşümden çakışma miktarını getirir (yoksa 0 döner)
     * @param {[number, number]} proj1
     * @param {[number, number]} proj2
     * @returns {number}
     */
    static #getOverlap([min1, max1], [min2, max2]) {
        return Math.max(0, Math.min(max1, max2) - Math.max(min1, min2));
    }
}