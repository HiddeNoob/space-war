/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = document.getElementById('canvas').getContext('2d');

const canvas = new Canvas(ctx);
console.log(canvas);
canvas.objects.push(new Entity(new Point(5,5),[new Point(2,5),new Point(2,2)],0,"#FFFFFF"));
canvas.startPaintingAsync();




