// 2D uzayda iki nokta arasındaki doğru parçasını temsil eden temel matematiksel sınıf
class Line {
    static #tolerans = 1e-2;

    /** @type {Entity} */
    belongsTo;

    /** @type {Vector} */
    startPoint;
    /** @type {Vector} */
    endPoint;

    /** @type {number} */
    lineWidth;

    /** @type {string} */
    lineColor;

    /**
     * Line oluşturucu
     * @param {number} x1 - Başlangıç noktası X
     * @param {number} y1 - Başlangıç noktası Y
     * @param {number} x2 - Bitiş noktası X
     * @param {number} y2 - Bitiş noktası Y
     * @param {number} lineWidth - Çizgi kalınlığı
     * @param {string} lineColor - Çizgi rengi
     */
    constructor(x1, y1, x2, y2, lineWidth = 1, lineColor = "#fff") {
        this.startPoint = new Vector(x1, y1);
        this.endPoint = new Vector(x2, y2);
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
    }

    /**
     * İki çizgi arasında kesişim noktası olup olmadığını bulur
     * @param {Line} other
     * @returns {Vector|null}
     */
    getIntersectPoint(other) {
        const intersectPoint = Line.#getIntersectPoint(this, other);

        /** @param {Vector} p1 * @param {Vector} p2 * @param {Vector} checkPoint */
        const isBetweenTheTwoPoints = (p1, p2, checkPoint) => {
            return (
                ((p1.y >= checkPoint.y && p2.y <= checkPoint.y) ||
                    (p1.y <= checkPoint.y && p2.y >= checkPoint.y)) &&
                ((p1.x >= checkPoint.x && p2.x <= checkPoint.x) ||
                    (p1.x <= checkPoint.x && p2.x >= checkPoint.x))
            );
        };

        if (
            isBetweenTheTwoPoints(this.startPoint, this.endPoint, intersectPoint) &&
            isBetweenTheTwoPoints(other.startPoint, other.endPoint, intersectPoint)
        ) {
            return intersectPoint;
        }
        return null;
    }

    /** @param {Line} l1 * @param {Line} l2 */
    static #getIntersectPoint(l1, l2) {
        /** @param {Line} line */
        const calculateA = (line) => line.slope();
        /** @param {Line} line */
        const calculateB = (line) => line.endPoint.y - calculateA(line) * line.endPoint.x;

        const slope1 = calculateA(l1);
        const slope2 = calculateA(l2);

        if (slope1 == Infinity) {
            const intersectPoint = new Vector(l1.startPoint.x, l2.findY(l1.startPoint.x));
            return intersectPoint;
        } else if (slope2 == Infinity) {
            const intersectPoint = new Vector(l2.startPoint.x, l1.findY(l2.startPoint.x));
            return intersectPoint;
        }

        const intersectX = (calculateB(l1) - calculateB(l2)) / (calculateA(l2) - calculateA(l1));
        const intersectY = calculateA(l1) * intersectX + calculateB(l1);
        return new Vector(intersectX, intersectY);
    }

    /**
     * Verilen X koordinatına karşılık gelen Y koordinatını bulur
     * @param {number} x
     * @returns {number|null}
     */
    findY(x) {
        const a = this.slope();

        if (a === Infinity) {
            return null;
        } else if (a < Line.#tolerans) {
            return this.startPoint.y;
        }

        const b = this.startPoint.y - this.startPoint.x * a;
        return x * a + b;
    }

    /**
     * Verilen Y koordinatına karşılık gelen X koordinatını bulur
     * @param {number} y
     * @returns {number|null}
     */
    findX(y) {
        const a = this.slope();
        if (a == Infinity) {
            return this.startPoint.x;
        } else if (a < Line.#tolerans) {
            return null;
        }

        const b = this.startPoint.y - this.startPoint.x * a;
        return (y - b) / a;
    }

    /**
     * Çizgiyi verilen vektöre taşır
     * @param {number} dx
     * @param {number} dy
     * @returns {Line}
     */
    moveLine(dx, dy) {
        this.startPoint.x += dx;
        this.startPoint.y += dy;
        this.endPoint.x += dx;
        this.endPoint.y += dy;
        return this;
    }

    /**
     * Çizginin açısını döndürür
     * @returns {number}
     */
    angle() {
        let angle = this.startPoint.copy().subtract(this.endPoint).angle();
        return angle;
    }

    /**
     * Çizginin eğimini döndürür
     * @returns {number}
     */
    slope() {
        const angle = this.angle();
        if (
            angle > Math.PI / 2 - Line.#tolerans &&
            angle < Math.PI / 2 + Line.#tolerans
        ) {
            return Infinity;
        }
        return Math.tan(angle);
    }

    /**
     * Çizgiyi verilen açı kadar döndürür
     * @param {number} angle
     * @param {Vector} [center]
     * @returns {Line}
     */
    rotateLine(angle, center = new Vector(0, 0)) {
        this.startPoint = this.startPoint.copy().subtract(center).rotate(angle).add(center);
        this.endPoint = this.endPoint.copy().subtract(center).rotate(angle).add(center);
        return this;
    }

    /**
     * Çizginin normal vektörünü döndürür
     * @param {Vector} [center]
     * @returns {Vector}
     */
    normalVector(center = null) {
        const dx = this.endPoint.x - this.startPoint.x;
        const dy = this.endPoint.y - this.startPoint.y;
        let normal = new Vector(-dy, dx);
        if (center) {
            const mid = this.centerPoint();
            const toCenter = center.copy().subtract(mid);
            if (normal.dot(toCenter) < 0) normal.multiply(-1);
        }
        return normal.normalize();
    }

    /**
     * Çizgiyi normalize eder
     * @returns {Vector}
     */
    normalize() {
        return new Vector(this.slope(), 1).normalize();
    }

    /**
     * Çizginin orta noktasını döndürür
     * @returns {Vector}
     */
    centerPoint() {
        return new Vector(
            (this.startPoint.x + this.endPoint.x) / 2,
            (this.startPoint.y + this.endPoint.y) / 2
        );
    }

    /**
     * Çizginin kopyasını oluşturur
     * @returns {Line}
     */
    copy() {
        return new Line(
            this.startPoint.x,
            this.startPoint.y,
            this.endPoint.x,
            this.endPoint.y,
            this.lineWidth,
            this.lineColor
        );
    }
}