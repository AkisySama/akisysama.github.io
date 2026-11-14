// Turns src/assets/portrait.jpg into the text portrait on the home page's cover.
// Run `node scripts/make-ascii-portrait.mjs` after replacing the picture.
//
// The picture is pale line art, so mapping brightness to a ramp of characters comes out as
// mush. It is read as three things instead:
//   - outlines, reduced to their centre line, where each cell takes the character whose
//     own shape is closest to the stroke crossing it (a slanted line becomes "/");
//   - filled areas such as the eyes, shaded with a ramp from light to dense characters;
//   - hair, the one area with a colour of its own, as an even tone of dots so the figure
//     stands off the page.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const option = (name, fallback) => Number(process.env[name] ?? fallback);

const SOURCE = fileURLToPath(new URL("../src/assets/portrait.jpg", import.meta.url));
const OUTPUT = process.env.OUT ?? fileURLToPath(new URL("../src/data/portrait.txt", import.meta.url));

const COLS = option("COLS", 96);
const STROKES = " .,:;'`\"^~-_=+<>/\\|()!";
const RAMP = ":-=+*#%@";
const HAIR_GLYPH = ".";
const GLYPH_FONT = "Menlo";
// One character cell, in the samples its shape is compared at. 0.6em wide at line-height 1.
const CELL_W = 6;
const CELL_H = 10;
// Brightness that counts as blank paper, and as full black.
const PAPER = option("PAPER", 200);
const BLACK = option("BLACK", 90);
// How dark a pixel has to be to belong to an outline.
const LINE_FROM = option("LINE", 0.5);
// Pixels taken off every edge before looking for filled areas, so outlines don't count.
const FILL_INSET = option("INSET", 1);
// How dark a cell has to be, outlines aside, to be shaded rather than drawn.
const FILL_FROM = option("FILL", 0.2);
// ...and the darkness that already gets the densest character, so the eyes carry weight.
const FILL_FULL = option("FULL", 0.6);
// How much a cell's overall darkness counts next to its shape.
const TONE_WEIGHT = option("TONE", 1);

const { data, info } = await sharp(SOURCE).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const rows = Math.round((COLS * (height / width) * CELL_W) / CELL_H);

const darkMap = Buffer.alloc(width * height);
const hairMap = Buffer.alloc(width * height);
for (let i = 0; i < width * height; i++) {
  const r = data[i * 3];
  const g = data[i * 3 + 1];
  const b = data[i * 3 + 2];
  const luma = r * 0.299 + g * 0.587 + b * 0.114;
  darkMap[i] = Math.min(1, Math.max(0, (PAPER - luma) / (PAPER - BLACK))) * 255;
  hairMap[i] = g - (r + b) / 2 > 2.5 && luma > 195 ? 255 : 0;
}

const inset = (map) => {
  const out = Buffer.alloc(map.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let low = 255;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = Math.min(width - 1, Math.max(0, x + dx));
          const yy = Math.min(height - 1, Math.max(0, y + dy));
          low = Math.min(low, map[yy * width + xx]);
        }
      }
      out[y * width + x] = low;
    }
  }
  return out;
};

// Reduces every stroke to its one-pixel centre line (Zhang–Suen thinning).
const centreLines = (map, threshold) => {
  const on = Uint8Array.from(map, (v) => (v > threshold ? 1 : 0));
  const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : on[y * width + x]);
  for (let changed = true; changed; ) {
    changed = false;
    for (const pass of [0, 1]) {
      const drop = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (!on[y * width + x]) continue;
          // Neighbours clockwise from the one above.
          const n = [at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1), at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1)];
          const total = n.reduce((a, v) => a + v, 0);
          if (total < 2 || total > 6) continue;
          let steps = 0;
          for (let i = 0; i < 8; i++) if (!n[i] && n[(i + 1) % 8]) steps++;
          if (steps !== 1) continue;
          if (pass === 0 ? n[0] * n[2] * n[4] || n[2] * n[4] * n[6] : n[0] * n[2] * n[6] || n[0] * n[4] * n[6]) continue;
          drop.push(y * width + x);
        }
      }
      for (const i of drop) on[i] = 0;
      changed ||= drop.length > 0;
    }
  }
  return on;
};

let fillMap = darkMap;
for (let i = 0; i < FILL_INSET; i++) fillMap = inset(fillMap);

const centre = centreLines(darkMap, LINE_FROM * 255);
const lineMap = Buffer.alloc(width * height);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (!centre[y * width + x]) continue;
    // Two pixels wide, so the stroke survives being scaled down.
    lineMap[y * width + x] = 255;
    lineMap[y * width + Math.min(width - 1, x + 1)] = 255;
    lineMap[Math.min(height - 1, y + 1) * width + x] = 255;
  }
}

const shrink = (map, w, h) =>
  sharp(map, { raw: { width, height, channels: 1 } })
    .resize(w, h, { fit: "fill", kernel: "lanczos3" })
    .toColourspace("b-w") // Otherwise it comes back with three channels.
    .raw()
    .toBuffer();

const lines = await shrink(lineMap, COLS * CELL_W, rows * CELL_H);
const fill = await shrink(fillMap, COLS, rows);
const hair = await shrink(hairMap, COLS, rows);

// Each stroke character, drawn at the same size and softened a little so that a line
// passing slightly off-centre still finds its match. Shape and overall tone are kept apart.
const escapeXml = (ch) => ch.replace("&", "&amp;").replace("<", "&lt;");
const strokes = await Promise.all(
  [...STROKES].map(async (ch) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CELL_W * 4}" height="${CELL_H * 4}">
      <rect width="100%" height="100%" fill="#000"/>
      <text x="0" y="${CELL_H * 4 * 0.846}" font-family="${GLYPH_FONT}" font-size="${CELL_H * 4}" fill="#fff">${escapeXml(ch)}</text>
    </svg>`;
    const pixels = await sharp(Buffer.from(svg)).resize(CELL_W, CELL_H, { fit: "fill" }).blur(0.6).toColourspace("b-w").raw().toBuffer();
    const shape = Float32Array.from(pixels, (v) => v / 255);
    const tone = shape.reduce((a, v) => a + v, 0) / shape.length;
    return { ch, tone, shape: shape.map((v) => v - tone) };
  }),
);

const output = [];
const cell = new Float32Array(CELL_W * CELL_H);
for (let row = 0; row < rows; row++) {
  let line = "";
  for (let col = 0; col < COLS; col++) {
    const shade = fill[row * COLS + col] / 255;
    if (shade > FILL_FROM) {
      const level = (shade - FILL_FROM) / (FILL_FULL - FILL_FROM);
      line += RAMP[Math.min(RAMP.length - 1, Math.floor(level * RAMP.length))];
      continue;
    }

    let tone = 0;
    for (let y = 0; y < CELL_H; y++) {
      for (let x = 0; x < CELL_W; x++) {
        const v = lines[(row * CELL_H + y) * COLS * CELL_W + col * CELL_W + x] / 255;
        cell[y * CELL_W + x] = v;
        tone += v;
      }
    }
    tone /= cell.length;

    let best = strokes[0];
    let bestError = Infinity;
    for (const stroke of strokes) {
      let error = 0;
      for (let i = 0; i < cell.length; i++) error += (cell[i] - tone - stroke.shape[i]) ** 2;
      error = error / cell.length + TONE_WEIGHT * (tone - stroke.tone) ** 2;
      if (error < bestError) {
        bestError = error;
        best = stroke;
      }
    }
    line += best.ch === " " && hair[row * COLS + col] > 127 ? HAIR_GLYPH : best.ch;
  }
  output.push(line.trimEnd());
}

await writeFile(OUTPUT, `${output.join("\n")}\n`);
console.log(`${COLS} × ${rows} → ${OUTPUT}`);
