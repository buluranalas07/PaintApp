export class Button {
  constructor(x, y, w, h, label, onClick) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.onClick = onClick;
    this.active = false; // for active state
  }

  draw() {
    if (this.active) {
      stroke(0, 100, 200); // blue if active
      strokeWeight(3);
    } else {
      stroke(0);
      strokeWeight(1);
    }

    fill(200);
    rect(this.x, this.y, this.w, this.h, 5);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  checkClick() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.onClick();
      return true;
    }
    return false;
  }
}
