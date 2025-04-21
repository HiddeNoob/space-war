const globalGameVariables = {
    previousLatestPaintTimestamp : 0,
    latestPaintTimestamp : Date.now(),
}
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
canvas.width = window.innerHeight * 1; 
canvas.height = window.innerHeight * 1;

const player = new Player(500);
const debug = Settings.default.debug;


function showMainMenu(){
    const menuManager = new MenuManager(document.getElementById("menu"),player);
    const mainMenu = new Menu("Main Menu");
    mainMenu.addOption(Component.create("Start Game",() => {
        const painter = new Canvas(ctx,canvas);
        const runner = new Game(painter,player);
        globalGameVariables.latestPaintTimestamp = Date.now() - globalGameVariables.latestPaintTimestamp;
        runner.run();
        menuManager.terminate();
    }));
    const settings = new Menu("Settings");
    settings.addOption(new ValueHolder("Volume",(newVolume) => {
        Settings.default.volume = newVolume;
    },0,100));
    mainMenu.addOption(settings)
    menuManager.push(mainMenu);
}

showMainMenu();










