import { Brush } from "./Classes/Brush.js";
import { PaintLayer } from "./Classes/PaintLayer.js";
import { Toolbar } from "./Classes/Toolbar.js";
import { runTests } from "./tests.js";

// config
const toolbarH = 70;
const bgColor = 255;
const colors = ['black', "#ff0000", "#00aa00", "#0000ff", "#ffaa00"];

//initial state
let brush, paintLayer, toolbar;
let isDrawing = false;
let prevX, prevY;



window.setup = function() {
  createCanvas(900, 600);
  brush = new Brush(color(colors[0]), 20);
  paintLayer = new PaintLayer(width, height, bgColor);
  toolbar = new Toolbar(brush, paintLayer, colors, toolbarH);

  runTests({ brush, toolbar}); 
};

window.draw = function() {
  cursor(mouseY > toolbarH ? 'none' : ARROW);

  paintLayer.render();
  toolbar.draw();
  toolbar.update();

  if (isDrawing) {
    paintLayer.drawBrush(brush, mouseX, mouseY, prevX, prevY);
    prevX = mouseX;
    prevY = mouseY;
  }

  if (mouseY > toolbarH) drawBrushPreview(mouseX, mouseY);
};

window.mousePressed = function() {
  if (mouseY < toolbarH) toolbar.checkClick();
  else {
    isDrawing = true;
    prevX = mouseX;
    prevY = mouseY;
  }
};

window.mouseReleased = function() {
  if (isDrawing) paintLayer.saveState();
  isDrawing = false;
  toolbar.release();
};

// brush preview
function drawBrushPreview(x, y) {
  push();
  let half = brush.size / 2;
  if (y - half < toolbarH) y = toolbarH + half;

  let size = max(5, brush.size);
  if (brush.type === "eraser") {
    fill(bgColor); stroke(150); strokeWeight(1);
  } else {
    fill(brush.color); noStroke();
  }
  ellipse(x, y, size);

  stroke(255); strokeWeight(1);
  let len = 8;
  line(x - len, y, x + len, y);
  line(x, y - len, x, y + len);
  pop();
}