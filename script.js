const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

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
    game: null

};

const debug = Settings.default.debug;
function showMainMenu() {
    const menuManager = new MenuManager(document.getElementById("menu"));
    const mainMenu = new Menu("Main Menu");
    mainMenu.addOption(Component.create("Start Game", () => {
        const playerDrawAttributes = new DrawAttributes(PlayerShapes.DEFAULT_PLAYER, new Vector(500, 100), 0);
        const player = new Player(500,1,1,playerDrawAttributes);
        const painter = new Canvas(ctx, canvas, new Camera(player, canvas.width, canvas.height));
        global.game = new Game(painter, player);
        global.game.run();
        menuManager.terminate();
        window.removeEventListener("resize", resizeCanvas);
    }));
    const settings = new Menu("Settings");
    settings.addOption(new ValueHolder("Volume", (newVolume) => {
        Settings.default.volume = newVolume;
    }, 0, 100));
    mainMenu.addOption(settings);
    menuManager.push(mainMenu);
}

showMainMenu();










