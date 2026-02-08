export class Brush {
  constructor(color, size, type = "brush") {
    this.color = color;
    this.size = size;
    this.type = type;
  }

  draw(g, x, y, px, py) {
    let dx = x - px;
    let dy = y - py;
    let distance = dist(x, y, px, py);

    for (let i = 0; i < distance; i++) {
      let ix = px + (dx * i) / distance;
      let iy = py + (dy * i) / distance;

      g.fill(this.type === "eraser" ? 255 : this.color);
      g.noStroke();
      g.ellipse(ix, iy, this.size);
    }
  }
}
