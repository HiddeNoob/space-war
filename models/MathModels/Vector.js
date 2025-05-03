// 2 boyutlu vektör işlemlerini sağlayan temel matematiksel sınıf
class Vector {
    /**
     * Vector oluşturucu
     * @param {number} x - X bileşeni
     * @param {number} y - Y bileşeni
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Vektörün kopyasını oluşturur
     * @returns {Vector}
     */
    copy() {
        return new Vector(this.x, this.y);
    }
    
    /**
     * Vektöre başka bir vektörü ekler
     * @param {Vector} vector
     * @returns {Vector}
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Vektörden başka bir vektörü çıkarır
     * @param {Vector} vector
     * @returns {Vector}
     */
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * Vektörü bir skaler ile çarpar
     * @param {number} scalar
     * @returns {Vector}
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Vektörü bir skaler ile böler
     * @param {number} scalar
     * @returns {Vector}
     */
    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        }
        throw new Error("Cannot divide by zero");
    }

    /**
     * Vektörün büyüklüğünü (normunu) döndürür
     * @returns {number}
     */
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * Birim vektörü döndürür
     * @returns {Vector}
     */
    normalize() {
        let mag = this.magnitude();
        return mag !== 0 ? this.divide(mag) : this;
    }

    /**
     * İki vektörün skaler çarpımını döndürür
     * @param {Vector} vector
     * @returns {number}
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * İki vektör arasındaki açıyı döndürür (radyan)
     * @param {Vector} vector 
     * @returns {number}
     */
    angleBetween(vector) {
        let dotProd = this.dot(vector);
        let mags = this.magnitude() * vector.magnitude();
        return mags !== 0 ? Math.acos(dotProd / mags) : 0;
    }

    /**
     * İki vektör arasındaki mesafeyi döndürür
     * @param {Vector} vector
     * @returns {number}
     */
    distanceTo(vector) {
        return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
    }

    /**
     * Vektörü verilen açı kadar döndürür
     * @param {number} angle
     * @returns {Vector}
     */
    rotate(angle) {
        let cosA = Math.cos(angle);
        let sinA = Math.sin(angle);
    
        let newX = this.x * cosA - this.y * sinA;
        let newY = this.x * sinA + this.y * cosA;
    
        this.x = newX;
        this.y = newY;
        return this;
    }

    /**
     * Vektörün açısını (radyan) döndürür
     * @returns {number}
     */
    angle(){
        return Math.atan2(this.y, this.x);
    }

    /**
     * İki vektörün dış çarpımını (cross product) döndürür
     * @param {Vector} vector
     * @returns {number}
     */
    crossProduct(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
}
