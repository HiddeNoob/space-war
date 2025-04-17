class ShapeFactory {
    /**
     * Divides a line into smaller lines if it exceeds the max length.
     * @param {Line} line
     * @param {number} maxLength
     * @returns {Line[]}
     */
    static divideLineIfExceeds(line, maxLength) {
        const start = line.startPoint;
        const end = line.endPoint;
        const distance = start.distanceTo(end);

        if (distance <= maxLength) {
            return [line];
        }

        const numSegments = Math.ceil(distance / maxLength);
        const segmentVector = end.copy().subtract(start).divide(numSegments);

        const dividedLines = [];
        let currentStart = start.copy();

        for (let i = 0; i < numSegments; i++) {
            const currentEnd = currentStart.copy().add(segmentVector);
            dividedLines.push(
                new Line(
                    currentStart.x,
                    currentStart.y,
                    currentEnd.x,
                    currentEnd.y,
                    line.lineWidth,
                    line.lineColor
                )
            );
            currentStart = currentEnd;
        }

        return dividedLines;
    }

    /**
     * @param {Line[]} lines
     * @param {number} maxLength
     */
    static enforceMaxLineLength(lines, maxLength) {
        const adjustedLines = [];
        lines.forEach((line) => {
            adjustedLines.push(...ShapeFactory.divideLineIfExceeds(line, maxLength));
        });
        return adjustedLines;
    }

    /**
     * @param {Line[]} lines
     */
    static createPolygon(lines) {
        const maxLineLength = Settings.default.maxLineLength;
        const adjustedLines = ShapeFactory.enforceMaxLineLength(lines, maxLineLength);
        return new Polygon(adjustedLines);
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