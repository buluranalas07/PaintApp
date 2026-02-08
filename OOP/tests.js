export function runTests({ brush, toolbar }) {
  let __t = { suiteStack: [], total: 0, passed: 0, failed: 0 };

  function describe(name, fn) {
    __t.suiteStack.push(name);
    try { fn(); } finally { __t.suiteStack.pop(); }
  }

  function it(name, fn) {
    const suite = __t.suiteStack.join(" > ");
    const fullName = suite ? `${suite} > ${name}` : name;
    __t.total++;
    try {
      fn();
      __t.passed++;
      console.log(`✅ ${fullName}`);
    } catch (err) {
      __t.failed++;
      console.error(`❌ ${fullName}\n   ${err.message}`);
    }
  }

  function expect(actual) {
    return {
      toBe(e) {
        if (actual !== e) throw new Error(`Expected ${e} but got ${actual}`);
      },
      toEqual(e) {
        if (JSON.stringify(actual) !== JSON.stringify(e))
          throw new Error(`Expected ${JSON.stringify(e)} but got ${JSON.stringify(actual)}`);
      }
    };
  }

  function testSummary() {
    console.log(`\n🧪 Tests: ${__t.total} | ✅ ${__t.passed} | ❌ ${__t.failed}\n`);
  }

  describe("OOP Sketch Functions", () => {

    it("Brush button sets brush type", () => {
      toolbar.brushButton.onClick();
      expect(brush.type).toBe("brush");
      expect(toolbar.brushButton.active).toBe(true);
    });

    it("Eraser button sets brush type", () => {
      toolbar.eraserButton.onClick();
      expect(brush.type).toBe("eraser");
      expect(toolbar.eraserButton.active).toBe(true);
    });

    it("Slider updates brush size", () => {
      toolbar.slider.onChange(30);
      expect(brush.size).toBe(30);
    });

  });

  testSummary();
}
