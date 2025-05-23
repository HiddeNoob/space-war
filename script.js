const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

// Önce canvas boyutunu ayarla
const resizeCanvas = () => {
    canvas.width = window.innerWidth * 1;
    canvas.height = window.innerHeight * 1;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
};
resizeCanvas();

/**
 * Body içerisinde menüyü çizmek için bir div oluşturur.
 * @returns {HTMLDivElement}
 */
function addMenuToHTML(){
        const htmlMenu = document.createElement("div");
        htmlMenu.classList.add("menu");
        document.body.append(htmlMenu);
        return htmlMenu;
}



const global = {
    previousLatestPaintTimestamp: 0,
    latestPaintTimestamp: Date.now(),
    pageInitTimestamp: Date.now(), 
    /** @type {Game} */
    game: null
};

function showMainMenu() {
    window.addEventListener("resize", resizeCanvas);
    const htmlMenu = addMenuToHTML();
    const menuManager = new MenuManager(htmlMenu);
    const mainMenu = new Menu("Space War");

    mainMenu.addOption(Component.create("Start Game", () => {
        const player = ReadyToUseObjects.players["DEFAULT_PLAYER"].copy();
        SFXPlayer.sfxs["background"].play();
        const painter = new Canvas(ctx, canvas, new Camera(player, canvas.width, canvas.height));
        global.game = new Game(painter, player);
        global.game.run();
        menuManager.terminate();

        player.onDeconstruct.push(() => { // on death
            const htmlMenu = addMenuToHTML();
            const deathMenuManager = new MenuManager(htmlMenu);
            const deathMenu = new Menu(`Score: ${player.money}`);
            SFXPlayer.sfxs["death-menu"].play();                
            deathMenu.addOption(Component.create("Restart", () => {
                deathMenuManager.terminate();
                SFXPlayer.sfxs["death-menu"].pause();
                painter.clearCanvas();
                showMainMenu();
            }));
            deathMenu.addOption(Component.create("Exit", () => {
                window.close();
            }));
            deathMenuManager.push(deathMenu);
            global.game.pause();

        });
        window.removeEventListener("resize", resizeCanvas);
    }));

    const settings = new Menu("Settings");

    settings.addOption(new ValueHolder("Volume", (newVolume) => {
        Settings.default.volume = newVolume;
        SFXPlayer.setAllEffectVolumes(Settings.default.volume);
    }, 0, 100, 50));

    settings.addOption(new ValueHolder("Difficulty", (newDifficulty) => {
        Settings.default.setDifficulty(newDifficulty);
    }, 1, 3));

    settings.addOption(new CheckBox("Debug Mode",false,(newDebug) => {
        Settings.default.debugMode = newDebug;
    }));

    mainMenu.addOption(settings);
    menuManager.push(mainMenu);
}

showMainMenu();










