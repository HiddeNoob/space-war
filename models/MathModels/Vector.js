class Vector {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }
    
    /**
     * @param {Vector} vector
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * @param {Vector} vector
     */
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * @param {number} scalar
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * @param {number} scalar
     */
    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        }
        throw new Error("Cannot divide by zero");
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        let mag = this.magnitude();
        return mag !== 0 ? this.divide(mag) : this;
    }

    /**
     * @param {Vector} vector
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * @param {Vector} vector 
     */
    angleBetween(vector) {
        let dotProd = this.dot(vector);
        let mags = this.magnitude() * vector.magnitude();
        return mags !== 0 ? Math.acos(dotProd / mags) : 0;
    }

    /**
     * @param {Vector} vector
     */
    distanceTo(vector) {
        return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * @param {number} angle
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

    angle(){
        return Math.atan2(this.y, this.x);
    }

    /**
     * @param {Vector} vector
     */
    crossProduct(vector) {
        return this.x * vector.y - this.y * vector.x;
    }
}
