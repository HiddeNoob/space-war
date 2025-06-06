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
        escape: false, // Escape tuşu basılı mı
        1: false,
        2: false,
        3: false,
        4: false
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
        this.#playerShot();
        this.#reloadWeapon();
        this.#changeWeapon();
        this.#isPressed.escape && this.#gamePause();
    };

    #gamePause(){
        if(global.game.isPaused) return;
        global.game.pause();
        // Menü oluştur ve göster
        const htmlMenu = addMenuToHTML();
        const menuManager = new MenuManager(htmlMenu);
        const pauseMenu = new Menu("Paused");
        pauseMenu.addOption(Component.create("Continue", () => {
            menuManager.terminate();
            global.game.continue();
        }));
        pauseMenu.addOption(Component.create("Main Menu", () => {
            global.game.canvasObject.clearCanvas();
            menuManager.terminate();
            showMainMenu();
        }));
        menuManager.push(pauseMenu);
    }

    #reloadWeapon() {
        if (this.#isPressed.r) {
            this.player.reloadWeapon();
        }
    }

    #playerShot(){
        if(this.#isPressed.leftMouse){
            const bullet = this.player.shoot();
            if (bullet) {
                this.grid.addEntity(bullet);
                Timer.addOneTimeTask(new Task(5000, () => bullet.isAlive = false));
                SFXPlayer.sfxs["shot"].play();
            }
        }
    }


    #changeWeapon() {
        switch (true) {
            case this.#isPressed[1]:
                this.player.changeWeapon(0);
                break;
            case this.#isPressed[2]:
                this.player.changeWeapon(1);
                break;
            case this.#isPressed[3]:
                this.player.changeWeapon(2);
                break;
            case this.#isPressed[4]:
                this.player.changeWeapon(3);
                break;
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
        window.addEventListener("mousedown", (e) => {
            switch(e.button){
                case 0:
                    this.#isPressed.leftMouse = true;
                    break;
                case 2:
                    this.#isPressed.rightMouse = true;
                    break;
            }
        });
        window.addEventListener("mouseup", (e) => {
            switch(e.button){
                case 0:
                    this.#isPressed.leftMouse = false;
                case 2:
                    this.#isPressed.rightMouse = true;
            }
        });
        document.addEventListener("visibilitychange", () => {
            this.#gamePause();
        });
        
    }
}
