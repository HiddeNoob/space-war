// Oyuncu hareketleri ve kullanıcı etkileşimlerini yöneten handler sınıfı
class UserActionHandler extends Handler {
    /** @type {Vector} */
    #latestClientMouseLocation = new Vector(0, 0); // Son mouse konumu (world koordinatı)

    #isPressed = {
        w: false, // W tuşu basılı mı
        s: false, // S tuşu basılı mı
        a: false, // A tuşu basılı mı
        d: false, // D tuşu basılı mı
        r: false, // R tuşu basılı mı
        esc: false, // Escape tuşu basılı mı
    };

    /**
     * UserActionHandler oluşturucu
     * @param {Player} player - Oyuncu
     * @param {Grid} grid - Oyun grid'i
     */
    constructor(player, grid,camera) {
        super(grid, player,camera);
    }

    init = () => {
        this.#addEventListener(); // Klavye ve mouse eventlerini dinlemeye başla
    };

    /**
     * Kullanıcıdan gelen hareket ve rotasyon komutlarını uygular
     */
    update = () => {
        this.#applyMovement();
        this.#applyRotation();
        this.#reloadWeapon();
    };

    #reloadWeapon() {
        if (this.#isPressed.r) {
            this.player.reloadWeapon();
        }
    }

    /**
     * Klavye ile hareket uygular
     */
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

    /**
     * Mouse ile rotasyon uygular
     */
    #applyRotation() {
        const mouseLocation = this.camera.screenToWorld(this.#latestClientMouseLocation.x, this.#latestClientMouseLocation.y);
        this.player.rotateTo(mouseLocation);
    }

    /**
     * Klavye ve mouse eventlerini dinler
     */
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
            this.#latestClientMouseLocation = new Vector(e.offsetX, e.offsetY);
        });
        window.addEventListener("mousedown", () => {
            const bullet = this.player.shoot();
            if (bullet) {
                this.grid.addEntity(bullet);
                SFXPlayer.sfxs["shot"].play();
            }
        });
    }
}
