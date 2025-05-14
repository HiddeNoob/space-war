const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
console.log(ReadyToUseObjects.players)
// Önce canvas boyutunu ayarla
canvas.width = window.innerWidth * 1;
canvas.height = window.innerHeight * 1;
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

const resizeCanvas = () => {
    canvas.width = window.innerWidth * 1;
    canvas.height = window.innerHeight * 1;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
};

window.addEventListener("resize", resizeCanvas);

const global = {
    previousLatestPaintTimestamp: 0,
    latestPaintTimestamp: Date.now(),
    pageInitTimestamp: Date.now(), 
    /** @type {Game} */
    game: null
};

const debug = Settings.default.debug;
function showMainMenu() {
    const menuManager = new MenuManager(document.getElementById("menu"));
    const mainMenu = new Menu("Main Menu");
    mainMenu.addOption(Component.create("Start Game", () => {
        const player = ReadyToUseObjects.players["DEFAULT_PLAYER"].copy();
        const painter = new Canvas(ctx, canvas, new Camera(player, canvas.width, canvas.height));
        global.game = new Game(painter, player);
        global.game.run();
        menuManager.terminate();
        window.removeEventListener("resize", resizeCanvas);
    }));
    const settings = new Menu("Settings");
    settings.addOption(new ValueHolder("Volume", (newVolume) => {
        Settings.default.volume = newVolume;
        SFXPlayer.setVolume(Settings.default.volume / 100);
    }, 0, 100));
    settings.addOption(new ValueHolder("Difficulty", (newDifficulty) => {
        Settings.default.difficulty = newDifficulty;
    }, 1, 3));
    mainMenu.addOption(settings);
    menuManager.push(mainMenu);
}

showMainMenu();










