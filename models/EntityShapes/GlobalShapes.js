class GlobalShapes {
  static TRIANGLE = new Polygon([
    new Line(0, 0, -4, 1),
    new Line(-4, 1, -4, -1),
    new Line(-4, -1, 0, 0),
  ]);

  static RECTANGLE = new Polygon([
    new Line(0, 0, 10, 0),
    new Line(10, 0, 10, 4),
    new Line(10, 4, 0, 4),
    new Line(0, 4, 0, 0,1,"#FF00FF"),
  ]);

  static createRegularPolygon(n, r, colorIndex = -1, color = "#000000") {
    const lines = [];
    const points = [];
  
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      points.push({ x, y });
    }
  
    for (let i = 0; i < n; i++) {
      const a = points[i];
      const b = points[(i + 1) % n];
      if (i === colorIndex) {
        lines.push(new Line(a.x, a.y, b.x, b.y, 1, color));
      } else {
        lines.push(new Line(a.x, a.y, b.x, b.y));
      }
    }
  
    return new Polygon(lines);
  }
  
}
