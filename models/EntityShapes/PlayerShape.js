class EntityShapes {
  /** @type {DrawAttributes} */
  static PLAYER_PAINT_OPTIONS = new DrawAttributes(
    new Polygon([
      new Line(0, 0, 20, 30),
      new Line(20, 30, -20, 30),
      new Line(-20, 30, 0, 0),
    ]),
    new Point(50, 50)
  );
}
