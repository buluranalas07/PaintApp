import { Button } from "./Button.js";
import { Slider } from "./Slider.js";

export class Toolbar {
  constructor(brush, paintLayer, colors, toolbarH) {
    this.brush = brush;
    this.paintLayer = paintLayer;
    this.colors = colors;
    this.toolbarH = toolbarH;

    this.buttons = [];
    this.colorCircles = [];
    this.slider = null;

    this.createUI();
  }

  createUI() {
    this.buttons.push(new Button(15, 25, 30, 30, "↺", () => this.paintLayer.undo()));
    this.buttons.push(new Button(45, 25, 30, 30, "↻", () => this.paintLayer.redo()));

    // Brush/Eraser with active states
    this.brushButton = new Button(85, 25, 60, 30, "Brush", () => {
      this.brush.type = "brush";
      this.setActiveButton(this.brushButton);
    });
    this.eraserButton = new Button(150, 25, 60, 30, "Eraser", () => {
      this.brush.type = "eraser";
      this.setActiveButton(this.eraserButton);
    });

    this.buttons.push(this.brushButton, this.eraserButton);

    this.buttons.push(new Button(770, 25, 70, 30, "Clear", () => this.paintLayer.clear()));

    // Slider for brush size
    this.slider = new Slider(520, 700, 40, 1, 100, this.brush.size, v => this.brush.size = v);

    // Color circles
    for (let i = 0; i < this.colors.length; i++) {
      this.colorCircles.push({
        x: 245 + i * 35,
        y: 40,
        color: color(this.colors[i])
      });
    }

    // Set default active button
    this.setActiveButton(this.brushButton);
  }

  setActiveButton(button) {
    this.buttons.forEach(b => b.active = false);
    button.active = true;
  }

  draw() {
    fill(240);
    rect(0, 0, width, this.toolbarH);
    stroke(200);
    line(0, this.toolbarH, width, this.toolbarH);

    this.buttons.forEach(b => b.draw());
    this.slider.draw();

    for (let c of this.colorCircles) {
      let active = this.brush.color.toString() === c.color.toString();
      if (active) stroke(0, 100, 200);
      else noStroke();
      fill(c.color);
      ellipse(c.x, c.y, active ? 26 : 24);
    }

    noStroke();
    fill(0);
    textSize(12);
    text("Size: " + this.brush.size, 520, 20);
  }

  checkClick() {
    for (let b of this.buttons) b.checkClick();

    for (let c of this.colorCircles) {
      if (dist(mouseX, mouseY, c.x, c.y) < 13) {
        this.brush.color = c.color;
        this.brush.type = "brush";
        this.setActiveButton(this.brushButton);
      }
    }

    this.slider.checkClick();
  }

  update() {
    this.slider.update();
  }

  release() {
    this.slider.release();
  }
}
