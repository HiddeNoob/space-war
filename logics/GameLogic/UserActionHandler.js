class UserActionHandler extends Handler {
    /** @type {Vector} */
    #latestClientMouseLocation = new Vector(0, 0);

    #isPressed = {
        w: false,
        s: false,
        a: false,
        d: false,
    };

    /**
     * @param {Player} player
     * @param {Grid} grid
     */
    constructor(player, grid) {
        super(grid, player);
        this.#addEventListener();
    }

    update = () => {
        this.#applyMovement();
        this.#applyRotation();
    };

    #applyMovement() {
        const movementVector = new Vector(0, 0);

        if (this.#isPressed.w) movementVector.y -= 1;
        if (this.#isPressed.s) movementVector.y += 1;
        if (this.#isPressed.a) movementVector.x -= 1;
        if (this.#isPressed.d) movementVector.x += 1;

        if (movementVector.magnitude() > 0) {
            movementVector.normalize();
            const targetLocation = this.player.drawAttributes.location.copy().add(movementVector.multiply(this.player.thrustPower));
            this.player.moveTo(targetLocation);
        }
    }

    #applyRotation() {
        const mouseLocation = this.#latestClientMouseLocation;
        this.player.rotateTo(mouseLocation);
    }

    #addEventListener() {
        window.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() in this.#isPressed) {
                this.#isPressed[e.key.toLowerCase()] = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key.toLowerCase() in this.#isPressed) {
                this.#isPressed[e.key.toLowerCase()] = false;
            }
        });

        canvas.addEventListener("mousemove", (e) => {
            // Mouse ekran koordinatını world koordinatına çevir
            this.#latestClientMouseLocation = Debugger.camera.screenToWorld(e.offsetX, e.offsetY);
        });

        window.addEventListener("mousedown", () => {
            this.player.shoot();
        });
    }
}
