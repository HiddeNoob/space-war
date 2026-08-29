class Asteroid extends Entity {
    constructor(
        drawAttributes = new DrawAttributes(
            ShapeFactory.polygonToShell(
                ShapeFactory.createPolygon([
                    new Line(0, -12, 9, -5),
                    new Line(9, -5, 14, 4),
                    new Line(14, 4, 6, 12),
                    new Line(6, 12, -8, 16),
                    new Line(-8, 16, -14, 6),
                    new Line(-14, 6, -12, -7),
                    new Line(-12, -7, 0, -12)
                ]),
                8,
                100,
                100
            ),
            new Vector(0, 0)
        ),
        motionAttributes = new MotionAttributes()
    ) {
        super(drawAttributes, motionAttributes);
        this.canCollide = true;
    }

    static createRandom(radius = 18) {
        const pointCount = 6 + Math.floor(Math.random() * 4);
        const points = [];
        for (let i = 0; i < pointCount; i++) {
            const angle = (Math.PI * 2 * i) / pointCount;
            const noise = 0.6 + Math.random() * 0.7;
            const x = Math.cos(angle) * radius * noise;
            const y = Math.sin(angle) * radius * noise;
            points.push(new Vector(x, y));
        }

        const asteroidPolygon = ShapeFactory.createPolygon(
            points.map((point, index) => {
                const next = points[(index + 1) % points.length];
                return new Line(point.x, point.y, next.x, next.y, 1.2, '#7a7a7a');
            })
        );

        const asteroid = new Asteroid(
            new DrawAttributes(ShapeFactory.polygonToShell(asteroidPolygon, 8, 100, 100), new Vector(0, 0), 0),
            new MotionAttributes(0.5, 0.5, 1e15)
        );
        asteroid.motionAttributes.mass *= 30;
        asteroid.motionAttributes.momentOfInertia *= 70;
        asteroid.drawAttributes.angle = Math.random() * Math.PI * 2;
        asteroid.setColor('#7a7a7a');
        console.log("astreoid:")
        console.log(asteroid)
        return asteroid;
    }
}
