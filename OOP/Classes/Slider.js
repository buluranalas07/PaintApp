export class Slider {
  constructor(x1, x2, y, minVal, maxVal, value, onChange) {
    this.x1 = x1;
    this.x2 = x2;
    this.y = y;
    this.minVal = minVal;
    this.maxVal = maxVal;
    this.value = value;
    this.onChange = onChange;
    this.dragging = false;
  }

  draw() {
    stroke(180);
    strokeWeight(4);
    line(this.x1, this.y, this.x2, this.y);

    let knobX = map(this.value, this.minVal, this.maxVal, this.x1, this.x2);
    noStroke();
    fill(50);
    ellipse(knobX, this.y, 14);
  }

  update() {
    if (this.dragging) {
      let newValue = map(mouseX, this.x1, this.x2, this.minVal, this.maxVal);
      newValue = constrain(newValue, this.minVal, this.maxVal);
      newValue = Math.round(newValue); // rounds to integer

      if (newValue !== this.value) {
        this.value = newValue;
        this.onChange(this.value);
      }
    }
  }

  checkClick() {
    let knobX = map(this.value, this.minVal, this.maxVal, this.x1, this.x2);
    if (dist(mouseX, mouseY, knobX, this.y) < 10) {
      this.dragging = true;
    }
  }

  release() {
    this.dragging = false;
  }
}
