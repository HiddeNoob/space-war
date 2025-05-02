const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

// Önce canvas boyutunu ayarla
canvas.width = window.innerHeight * 1;
canvas.height = window.innerHeight * 1;

const player = new Player(500);
const painter = new Canvas(ctx, canvas);

const global = {
    previousLatestPaintTimestamp: 0,
    latestPaintTimestamp: Date.now(),
    game: new Game(painter, player)

};

// Player ve oyun nesnelerini canvas boyutu ayarlandıktan sonra oluştur


const debug = Settings.default.debug;
function showMainMenu() {
    const menuManager = new MenuManager(document.getElementById("menu"), global.game.player);
    const mainMenu = new Menu("Main Menu");
    mainMenu.addOption(Component.create("Start Game", () => {
        global.game.run();
        menuManager.terminate();
    }));
    const settings = new Menu("Settings");
    settings.addOption(new ValueHolder("Volume", (newVolume) => {
        Settings.default.volume = newVolume;
    }, 0, 100));
    mainMenu.addOption(settings);
    menuManager.push(mainMenu);
}

showMainMenu();










