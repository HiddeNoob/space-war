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
}
