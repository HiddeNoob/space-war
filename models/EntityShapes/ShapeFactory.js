// Oyun içi çokgen, dikdörtgen gibi şekilleri kolayca oluşturmaya yarayan fabrika sınıfı
class ShapeFactory {
    /**
     * Verilen çizgilerden bir Polygon nesnesi oluşturur
     * @param {Line[]} lines
     * @returns {Polygon}
     */
    static createPolygon(lines) {
        // Kullanıcıdan gelen çizgilerde de kontrol et
        return new Polygon(lines);
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

    static polygonToShell(polygon,durability = 10,health = 100,maxHealth = 100,){ {
        const lines = polygon.lines.map(line => new BreakableLine(line,health,maxHealth,durability));
        return new EntityShell(lines);
        }
    }
}