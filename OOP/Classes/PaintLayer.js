export class PaintLayer {
  constructor(w, h, bgColor) {
    this.g = createGraphics(w, h);
    this.bgColor = bgColor;
    this.g.background(bgColor);

    this.history = [];
    this.redoStack = [];
    this.saveState();
  }

  render() {
    image(this.g, 0, 0);
  }

  drawBrush(brush, x, y, px, py) {
    brush.draw(this.g, x, y, px, py);
  }

  saveState() {
    this.history.push(this.g.get());
    if (this.history.length > 30) this.history.shift();
    this.redoStack = [];
  }

  undo() {
    if (this.history.length > 1) {
      this.redoStack.push(this.history.pop());
      this.g.image(this.history[this.history.length - 1], 0, 0);
    }
  }

  redo() {
    if (this.redoStack.length) {
      let state = this.redoStack.pop();
      this.history.push(state);
      this.g.image(state, 0, 0);
    }
  }

  clear() {
    this.g.background(this.bgColor);
    this.saveState();
  }
}
