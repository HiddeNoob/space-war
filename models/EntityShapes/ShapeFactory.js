// Oyun içi çokgen, dikdörtgen gibi şekilleri kolayca oluşturmaya yarayan fabrika sınıfı
class ShapeFactory {
    /**
     * Verilen çizgilerden bir Polygon nesnesi oluşturur
     * @param {Line[]} lines
     * @returns {Polygon}
     */
    static createPolygon(lines) {
        if (!Array.isArray(lines) || lines.length < 3) {
            throw new Error("A polygon needs at least 3 edges.");
        }

        const vertices = [];
        lines.forEach((line) => {
            vertices.push(line.startPoint.copy());
            vertices.push(line.endPoint.copy());
        });

        const convexVertices = ShapeFactory.#makeConvexVertices(vertices);
        const orderedLines = [];
        for (let i = 0; i < convexVertices.length; i++) {
            const start = convexVertices[i];
            const end = convexVertices[(i + 1) % convexVertices.length];
            orderedLines.push(new Line(start.x, start.y, end.x, end.y, 1, "#FFFFFF"));
        }

        return new Polygon(orderedLines);
    }

    static #makeConvexVertices(points) {
        if (points.length < 3) return points;

        const unique = [];
        points.forEach((point) => {
            const alreadyExists = unique.some((existing) =>
                Math.abs(existing.x - point.x) < 1e-6 && Math.abs(existing.y - point.y) < 1e-6
            );
            if (!alreadyExists) unique.push(point.copy());
        });

        if (unique.length < 3) return unique;

        const sorted = unique.slice().sort((a, b) => {
            if (a.x === b.x) return a.y - b.y;
            return a.x - b.x;
        });

        const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
        const lower = [];
        for (const point of sorted) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
                lower.pop();
            }
            lower.push(point);
        }

        const upper = [];
        for (let i = sorted.length - 1; i >= 0; i--) {
            const point = sorted[i];
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
                upper.pop();
            }
            upper.push(point);
        }

        const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
        return hull.length >= 3 ? hull : unique;
    }

    /**
     * n kenarlı düzgün çokgenin köşe noktalarını döndürür
     * @param {number} n - Kenar sayısı
     * @param {number} r - Yarıçap
     * @returns {Vector[]}
     */
    static #getPolygonPoints(n, r) {
        const points = [];
        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI * i) / n;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            points.push(new Vector(x, y));
        }
        return points;
    }


    /**
     * n kenarlı düzgün çokgen oluşturur
     * @param {number} n - Kenar sayısı
     * @param {number} r - Yarıçap
     * @param {string} color - Çizgi rengi
     * @returns {Polygon}
     */
    static createRegularPolygon(n, r, color = "#FFFFFF",thickness = 1) {
        const maxLen = Settings.default.gridCellSize;
        const points = ShapeFactory.#getPolygonPoints(n, r);
        const lines = [];
        for (let i = 0; i < n; i++) {
            const start = points[i];
            const end = points[(i + 1) % n];
            lines.push(new Line(start.x, start.y, end.x, end.y, thickness, color));
        }
        return new Polygon(lines);
    }

    /**
     * Dikdörtgen oluşturur
     * @param {number} width - Genişlik
     * @param {number} height - Yükseklik
     * @param {string} color - Çizgi rengi
     * @returns {Polygon}
     */
    static createRectangle(width, height, color = "#FFFFFF",thickness = 1) {
        const hw = width / 2;
        const hh = height / 2;
        const points = [
            new Vector(-hw, -hh),
            new Vector(hw, -hh),
            new Vector(hw, hh),
            new Vector(-hw, hh)
        ];
        const lines = [];
        const maxLen = Settings.default.gridCellSize;
        for (let i = 0; i < 4; i++) {
            const start = points[i];
            const end = points[(i + 1) % 4];
            lines.push(new Line(start.x, start.y, end.x, end.y, thickness, color));
        }
        return ShapeFactory.createPolygon(lines);
    }

    static createPlus(size, color = "#FFFFFF", thickness = 2) {
        // Build the plus as one closed ordered polygon loop so each segment starts
        // exactly where the previous one ends while keeping the middle visibly hollow.
        const halfArm = size / 2;
        const halfThickness = thickness / 2;
        const gap = Math.max(thickness * 2, 4);
        const halfGap = gap / 2;

        const points = [
            new Vector(-halfArm, -halfThickness),
            new Vector(-halfGap, -halfThickness),
            new Vector(-halfGap, -halfArm),
            new Vector(-halfThickness, -halfArm),
            new Vector(-halfThickness, -halfGap),
            new Vector(-halfArm, -halfGap),
            new Vector(-halfArm, halfGap),
            new Vector(-halfThickness, halfGap),
            new Vector(-halfThickness, halfArm),
            new Vector(-halfGap, halfArm),
            new Vector(-halfGap, halfThickness),
            new Vector(-halfArm, halfThickness),
            new Vector(halfArm, halfThickness),
            new Vector(halfGap, halfThickness),
            new Vector(halfGap, halfArm),
            new Vector(halfThickness, halfArm),
            new Vector(halfThickness, halfGap),
            new Vector(halfArm, halfGap),
            new Vector(halfArm, -halfGap),
            new Vector(halfThickness, -halfGap),
            new Vector(halfThickness, -halfArm),
            new Vector(halfGap, -halfArm),
            new Vector(halfGap, -halfThickness),
            new Vector(halfArm, -halfThickness)
        ];

        const lines = [];
        for (let i = 0; i < points.length; i++) {
            const start = points[i];
            const end = points[(i + 1) % points.length];
            lines.push(new Line(start.x, start.y, end.x, end.y, thickness, color));
        }

        return new Polygon(lines);
    }

    static polygonToShell(polygon,durability = 10,health = 100,maxHealth = 100,){ {
        const lines = polygon.lines.map(line => new BreakableLine(line,health,maxHealth,durability));
        return new EntityShell(lines);
        }
    }
}