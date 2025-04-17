class ShapeFactory {

    /**
     * @param {Line[]} lines
     */
    static createPolygon(lines) {
        return new Polygon(lines);
    }

    /**
     * @param {number} n
     * @param {number} r
     * @param {string} color
     */
    static createRegularPolygon(n, r, color = "#FFFFFF") {
        const lines = [];
        const points = [];

        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI * i) / n;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            points.push(new Vector(x, y));
        }

        for (let i = 0; i < n; i++) {
            const start = points[i];
            const end = points[(i + 1) % n];
            lines.push(new Line(start.x, start.y, end.x, end.y, 1, color));
        }

        return ShapeFactory.createPolygon(lines);
    }
}