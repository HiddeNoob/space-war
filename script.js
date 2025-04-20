const globalGameVariables = {
    previousLatestPaintTimestamp : 0,
    latestPaintTimestamp : 1,
}
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
canvas.width = window.innerHeight * 1; 
canvas.height = window.innerHeight * 1;

const menuManager = new MenuManager(document.getElementById("menu"));
const mainMenu = new Menu("test");
const sub = new Menu("subMenu");
sub.addOption(Component.create("1"));
sub.addOption(Component.create("2"));
mainMenu.addOption(Component.create("TEST1"))
mainMenu.addOption(Component.create("TEST2"))
mainMenu.addOption(sub)
menuManager.push(mainMenu);
menuManager.drawCurrentState();

const painter = new Canvas(ctx,canvas);

const runner = new Game(painter);

const debug = Settings.default.debug;
runner.run();




