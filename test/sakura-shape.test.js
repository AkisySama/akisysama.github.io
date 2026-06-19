const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const scriptPath = path.join(__dirname, '..', 'source', 'js', 'sakura.js');
const script = fs.readFileSync(scriptPath, 'utf8');

const drawnObjects = [];
let currentObject = null;

function record(op) {
  if (currentObject) {
    currentObject.push(op);
  }
}

const context2d = {
  save() {
    currentObject = [];
    drawnObjects.push(currentObject);
  },
  restore() {
    currentObject = null;
  },
  translate() { record('translate'); },
  rotate() { record('rotate'); },
  scale() { record('scale'); },
  beginPath() { record('beginPath'); },
  moveTo() { record('moveTo'); },
  bezierCurveTo() { record('bezierCurveTo'); },
  lineTo() { record('lineTo'); },
  closePath() { record('closePath'); },
  arc() { record('arc'); },
  fill() { record('fill'); },
  clearRect() {},
  createLinearGradient() {
    return { addColorStop() {} };
  },
};

const canvas = {
  style: {},
  width: 0,
  height: 0,
  getContext(type) {
    assert.strictEqual(type, '2d');
    return context2d;
  },
};

const sandbox = {
  Math,
  document: {
    body: {
      appendChild(node) {
        assert.strictEqual(node, canvas);
      },
    },
    createElement(tagName) {
      assert.strictEqual(tagName, 'canvas');
      return canvas;
    },
  },
  window: {
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener() {},
  },
  requestAnimationFrame() {},
};

vm.runInNewContext(script, sandbox, { filename: scriptPath });

assert.ok(drawnObjects.length > 0, 'Expected the sakura effect to draw at least one object.');

const firstObject = drawnObjects[0];
const count = (op) => firstObject.filter((item) => item === op).length;

assert.ok(
  count('beginPath') >= 5,
  `Expected each falling object to be a multi-petal sakura blossom; first object used ${count('beginPath')} path(s).`
);
assert.ok(
  count('bezierCurveTo') >= 8,
  `Expected each falling object to draw multiple sakura petals; first object used ${count('bezierCurveTo')} curve(s).`
);
