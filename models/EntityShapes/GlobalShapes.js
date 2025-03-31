class GlobalShapes {
  static TRIANGLE = new Polygon([
    new Line(0, 0, -30, 10),
    new Line(-30, 10, -30, -10),
    new Line(-30, -10, 0, 0),
  ]);

  static RECTANGLE = new Polygon([
    new Line(0, 0, 30, 0),
    new Line(30, 0, 30, 10),
    new Line(30, 10, 0, 10),
    new Line(0, 10, 0, 0),
  ]);
}
