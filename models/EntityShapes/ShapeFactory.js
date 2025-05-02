class ShapeFactory {

    /**
     * @param {Line[]} lines
     */
    static createPolygon(lines) {
        // Kullanıcıdan gelen çizgilerde de kontrol et
        return new Polygon(ShapeFactory.splitPolygonLinesIfNeeded(lines));
    }

    /**
     * @param {number} n
     * @param {number} r
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
     * @param {Vector} start
     * @param {Vector} end
     * @param {number} maxLen
     * @param {string} color
     * @returns {Line[]}
     */
    static #splitLineToSegments(start, end, maxLen, color) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const lines = [];
        if (length > maxLen) {
            const numSegments = Math.ceil(length / maxLen);
            for (let j = 0; j < numSegments; j++) {
                const t1 = j / numSegments;
                const t2 = (j + 1) / numSegments;
                const sx = start.x + dx * t1;
                const sy = start.y + dy * t1;
                const ex = start.x + dx * t2;
                const ey = start.y + dy * t2;
                lines.push(new Line(sx, sy, ex, ey, 1, color));
            }
        } else {
            lines.push(new Line(start.x, start.y, end.x, end.y, 1, color));
        }
        return lines;
    }

    /**
     * Checks if a line is longer than allowed cell size
     * @param {Line} line
     * @returns {boolean}
     */
    static #isLineTooLong(line) {
        const dx = line.endPoint.x - line.startPoint.x;
        const dy = line.endPoint.y - line.startPoint.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        return length > Settings.default.gridCellSize;
    }

    /**
     * Splits all lines in the array if they are too long
     * @param {Line[]} lines
     * @returns {Line[]}
     */
    static splitPolygonLinesIfNeeded(lines) {
        const maxLen = Settings.default.gridCellSize;
        const result = [];
        for (const line of lines) {
            if (ShapeFactory.#isLineTooLong(line)) {
                const dx = line.endPoint.x - line.startPoint.x;
                const dy = line.endPoint.y - line.startPoint.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const numSegments = Math.ceil(length / maxLen);
                for (let j = 0; j < numSegments; j++) {
                    const t1 = j / numSegments;
                    const t2 = (j + 1) / numSegments;
                    const sx = line.startPoint.x + dx * t1;
                    const sy = line.startPoint.y + dy * t1;
                    const ex = line.startPoint.x + dx * t2;
                    const ey = line.startPoint.y + dy * t2;
                    result.push(new Line(sx, sy, ex, ey, line.lineWidth, line.lineColor));
                }
            } else {
                result.push(line);
            }
        }
        return result;
    }

    /**
     * @param {number} n
     * @param {number} r
     * @param {string} color
     */
    static createRegularPolygon(n, r, color = "#FFFFFF") {
        const maxLen = Settings.default.gridCellSize;
        const points = ShapeFactory.#getPolygonPoints(n, r);
        const lines = [];
        for (let i = 0; i < n; i++) {
            const start = points[i];
            const end = points[(i + 1) % n];
            lines.push(...ShapeFactory.#splitLineToSegments(start, end, maxLen, color));
        }
        return new Polygon(lines);
    }

    /**
     * @param {number} width
     * @param {number} height
     * @param {string} color
     */
    static createRectangle(width, height, color = "#FFFFFF") {
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
            lines.push(...ShapeFactory.#splitLineToSegments(start, end, maxLen, color));
        }
        return ShapeFactory.createPolygon(lines);
    }
}