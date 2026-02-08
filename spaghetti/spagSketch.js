// config
let toolbarH = 70;
let bgColor = 255;
let brushColor;
let brushSize = 20;
let tool = "brush";
let colors = ['black', "#ff0000", "#00aa00", "#0000ff", "#ffaa00"];

let isDraggingSlider = false;
let isDrawing = false;
let history = [];
let redoStack = [];

let paintLayer;

// For smooth drawing
let pmouseXPrev, pmouseYPrev;

// Guard for valid drawing start
let canDraw = false;

//setup
function setup() {
  createCanvas(900, 600);

  paintLayer = createGraphics(width, height);
  paintLayer.background(bgColor);
  paintLayer.noStroke();

  brushColor = color(colors[0]);
  saveState();
}


function draw() {
  cursor(mouseY > toolbarH ? 'none' : ARROW);

  image(paintLayer, 0, 0);

  if (mouseY > toolbarH) {
    drawBrushPreview(mouseX, mouseY);
    drawWhiteCross(mouseX, mouseY);
  }

  drawToolbar();

  if (isDraggingSlider && mouseIsPressed) {
    updateBrushSize();
  }

  // smooth drawing
  if (isDrawing && mouseIsPressed && canDraw) {
    paintLayer.fill(tool === "eraser" ? bgColor : brushColor);

    let dx = mouseX - pmouseXPrev;
    let dy = mouseY - pmouseYPrev;
    let distance = dist(mouseX, mouseY, pmouseXPrev, pmouseYPrev);

    for (let i = 0; i < distance; i += 1) { 
      let x = pmouseXPrev + (dx * i) / distance;
      let y = pmouseYPrev + (dy * i) / distance;
      renderBrush(paintLayer, x, y);
    }

    pmouseXPrev = mouseX;
    pmouseYPrev = mouseY;
  }
}

// listeners
function mousePressed() {
  if (mouseY < toolbarH) {
    if (mouseX > 520 && mouseX < 700 && mouseY > 25 && mouseY < 55) {
      isDraggingSlider = true;
      updateBrushSize();
    } else {
      handleToolbarClick();
    }
    canDraw = false; // don't draw from toolbar
  } else {
    isDrawing = true;
    canDraw = true; // valid drawing start
    pmouseXPrev = mouseX;
    pmouseYPrev = mouseY;

    paintLayer.fill(tool === "eraser" ? bgColor : brushColor);
    renderBrush(paintLayer, mouseX, mouseY);
    saveState();
  }
}

function mouseReleased() {
  isDraggingSlider = false;
  isDrawing = false;
  canDraw = false; // stop drawing until next valid click
}


function updateBrushSize() {
  brushSize = int(map(mouseX, 520, 700, 1, 100));
  brushSize = constrain(brushSize, 1, 100);
}

function renderBrush(g, x, y) {
  let half = brushSize / 2;
  if (y - half < toolbarH) y = toolbarH + half;
  g.ellipse(x, y, brushSize);
}


function drawBrushPreview(x, y) {
  if (y < toolbarH) return;

  push();

  // Keep cursor above toolbar
  let half = brushSize / 2;
  if (y - half < toolbarH) y = toolbarH + half;

  // clamp
  let previewSize = max(5, brushSize);

  if (tool === "eraser") {
    fill(bgColor);
    stroke(150);
    strokeWeight(1);
  } else {
    fill(brushColor);
    noStroke();
  }

  ellipse(x, y, previewSize);
  pop();
}

function drawWhiteCross(x, y) {
  push();
  stroke(255);
  strokeWeight(1);
  let len = 8;
  line(x - len, y, x + len, y);
  line(x, y - len, x, y + len);
  pop();
}

// UI
function drawToolbar() {
  push();
  let canHover = !isDrawing; //disables hovering on buttons while drawing

  fill(240);
  noStroke();
  rect(0, 0, width, toolbarH);

  stroke(200);
  line(0, toolbarH, width, toolbarH);
  noStroke();

  drawIconBtn(15, 20, 30, 30, "↺", canHover && mouseX > 15 && mouseX < 45 && mouseY > 20 && mouseY < 50);
  drawIconBtn(45, 20, 30, 30, "↻", canHover && mouseX > 45 && mouseX < 75 && mouseY > 20 && mouseY < 50);

  drawButton(85, 25, 60, 30, "Brush", tool === "brush", canHover);
  drawButton(150, 25, 60, 30, "Eraser", tool === "eraser", canHover);

  // Colors
  for (let i = 0; i < colors.length; i++) {
    let x = 245 + i * 35; 
    let isActive = brushColor.toString() === color(colors[i]).toString();

    if (isActive) {
      stroke(0, 100, 255);
      strokeWeight(2);          
      strokeJoin(ROUND);
      strokeCap(ROUND);
    } else {
      noStroke();
    }

    fill(colors[i]);
    ellipse(x, 40, 24 - (isActive ? 2 : 0));
    noStroke();
  }

  fill(0);
  textAlign(LEFT);
  textSize(12);
  text("Size: " + brushSize, 520, 20);

  // Slider
  let knobX = map(brushSize, 1, 100, 520, 700);
  stroke(180);
  strokeWeight(4);
  line(520, 40, 700, 40);
  noStroke();
  fill(50);
  ellipse(knobX, 40, 14);

  drawButton(770, 25, 70, 30, "Clear", false, canHover);

  pop();
}

// button states
function drawButton(x, y, w, h, label, isActive, canHover) {
  let isHovered = canHover && mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;

  if (isActive) fill(100, 150, 255);
  else if (mouseIsPressed && isHovered) fill(150);
  else if (isHovered) fill(210);
  else fill(230);

  stroke(180);
  strokeWeight(1);
  rect(x, y, w, h, 5);

  fill(isActive ? 255 : 0);
  noStroke();
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

function drawIconBtn(x, y, w, h, icon, isHovered) {
  if (mouseIsPressed && isHovered) fill(180);
  else if (isHovered) fill(220);
  else noFill();

  rect(x, y, w, h, 4);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(icon, x + w / 2, y + h / 2);
  textSize(12);
}

// navigation
function handleToolbarClick() {
  if (mouseY > 20 && mouseY < 50) {
    if (mouseX > 15 && mouseX < 45) undo();
    if (mouseX > 45 && mouseX < 75) redo();
  }

  if (mouseX > 85 && mouseX < 145) tool = "brush";
  if (mouseX > 150 && mouseX < 210) tool = "eraser";

  for (let i = 0; i < colors.length; i++) {
    let x = 245 + i * 35;
    if (dist(mouseX, mouseY, x, 40) < 13) {
      brushColor = color(colors[i]);
      tool = "brush";
    }
  }

  if (mouseX > 770 && mouseX < 840 && mouseY > 25 && mouseY < 55) {
    paintLayer.background(bgColor);
    saveState();
  }
}

// undo/redo 
function saveState() {
  history.push(paintLayer.get());
  if (history.length > 30) history.shift();
  redoStack = [];
}

function undo() {
  if (history.length > 1) {
    redoStack.push(history.pop());
    paintLayer.image(history[history.length - 1], 0, 0);
  }
}

function redo() {
  if (redoStack.length > 0) {
    let state = redoStack.pop();
    history.push(state);
    paintLayer.image(state, 0, 0);
  }
}
