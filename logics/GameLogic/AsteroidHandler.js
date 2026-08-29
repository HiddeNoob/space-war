class AsteroidHandler extends Handler {
    init = () => {
        console.log("AsteroidHandler initialized");
        this.#spawnAsteroidsInView(Math.max(8, Settings.default.asteroidCount || 12));
    }

    update = () => {
        let asteroidCount = 0;
        this.grid.applyToCertainEntities(Asteroid.name, () => {
            asteroidCount += 1;
        });

        const targetCount = Settings.default.asteroidCount || 12;
        if (asteroidCount < targetCount) {
            this.#spawnAsteroidsInView(targetCount - asteroidCount);
        }
    }

    #spawnAsteroidsInView(count) {
        const topLeft = this.camera.screenToWorld(0, 0);
        const bottomRight = this.camera.screenToWorld(
            this.camera.screenWidth,
            this.camera.screenHeight
        );
        const padding = 120;

        for (let i = 0; i < count; i++) {
            const asteroid = Asteroid.createRandom(18 + Math.random() * 25);
            const side = Math.floor(Math.random() * 4);
            let x;
            let y;

            if (side === 0) {
                x = topLeft.x - padding;
                y = topLeft.y + Math.random() * (bottomRight.y - topLeft.y);
            } else if (side === 1) {
                x = bottomRight.x + padding;
                y = topLeft.y + Math.random() * (bottomRight.y - topLeft.y);
            } else if (side === 2) {
                x = topLeft.x + Math.random() * (bottomRight.x - topLeft.x);
                y = topLeft.y - padding;
            } else {
                x = topLeft.x + Math.random() * (bottomRight.x - topLeft.x);
                y = bottomRight.y + padding;
            }

            asteroid.setLocation(new Vector(x, y));
            asteroid.motionAttributes.velocity = new Vector(Math.random() * 0.1, Math.random() * 0.1)
            this.grid.addEntity(asteroid);
        }
    }
}