class GlobalShapes {
    static TRIANGLE = ShapeFactory.createPolygon([
        new Line(0, 0, -3, 1),
        new Line(-3, 1, -3, -1),
        new Line(-3, -1, 0, 0),
    ]).scaleBy(10);

    static SQUARE = ShapeFactory.createRegularPolygon(4,4);

    static RECTANGLE = ShapeFactory.createPolygon([
        new Line(0, 0, 5, 0),
        new Line(5, 0, 5, 4),
        new Line(5, 4, 0, 4),
        new Line(0, 4, 0, 0, 1, "#FF00FF"),
    ]).scaleBy(20);

    static DEFAULT_BULLET = GlobalShapes.RECTANGLE.copy()
    static THIN_AND_LONG_RECTANGLE = ShapeFactory.createPolygon([
        new Line(5, 0, 5, 1),
        new Line(5, 1, -5, 1),
        new Line(-5, 1, -5, 0),
        new Line(-5, 0, 5, 0)
    ]);
}
