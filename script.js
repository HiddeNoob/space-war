const globalGameVariables = {
    previousLatestPaintTimestamp : 0,
    latestPaintTimestamp : 1,
}
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
canvas.width = window.innerHeight * 1; 
canvas.height = window.innerHeight * 1;
const painter = new Canvas(ctx,canvas);

const runner = new Game(painter);

const debug = Settings.default.debug;
runner.run();




