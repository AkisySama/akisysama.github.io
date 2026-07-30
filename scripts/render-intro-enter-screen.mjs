import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(scriptsDirectory);
const sourcePath = join(
  projectRoot,
  "public/images/intro/pixel-room-side-open.webp",
);
const outputPath = join(
  projectRoot,
  "public/images/intro/pixel-room-side-enter.webp",
);

const { data: source, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = Buffer.from(source);
const channels = info.channels;
const pixelOffset = (x, y) => (y * info.width + x) * channels;

// Remove only the luminous pixels that form the baked-in PLAY label. Copying
// nearby screen texture keeps the edit invisible instead of painting a flat box.
const labelBounds = { left: 1314, top: 673, right: 1397, bottom: 700 };
const luminous = new Set();

for (let y = labelBounds.top; y <= labelBounds.bottom; y += 1) {
  for (let x = labelBounds.left; x <= labelBounds.right; x += 1) {
    const offset = pixelOffset(x, y);
    const red = source[offset];
    const green = source[offset + 1];
    const blue = source[offset + 2];

    if (blue > 116 && (red > 10 || green > 21)) {
      luminous.add(`${x},${y}`);
    }
  }
}

const eraseMask = new Set();
for (const point of luminous) {
  const [x, y] = point.split(",").map(Number);

  for (let offsetY = -2; offsetY <= 2; offsetY += 1) {
    for (let offsetX = -2; offsetX <= 2; offsetX += 1) {
      eraseMask.add(`${x + offsetX},${y + offsetY}`);
    }
  }
}

for (const point of eraseMask) {
  const [x, y] = point.split(",").map(Number);
  if (
    x < labelBounds.left ||
    x > labelBounds.right ||
    y < labelBounds.top ||
    y > labelBounds.bottom
  ) {
    continue;
  }

  const targetOffset = pixelOffset(x, y);
  const textureY = 664 + ((x + y) % 7);
  const textureOffset = pixelOffset(x, textureY);

  pixels[targetOffset] = source[textureOffset];
  pixels[targetOffset + 1] = source[textureOffset + 1];
  pixels[targetOffset + 2] = source[textureOffset + 2];
  pixels[targetOffset + 3] = 255;
}

// Remove the original play triangle while preserving the timer below it. The
// replacement texture is interpolated from clean screen pixels on both sides,
// so the empty space keeps the laptop display's subtle blue falloff.
const playIconBounds = { left: 1318, top: 697, right: 1368, bottom: 738 };
const playIconPixels = new Set();

for (let y = playIconBounds.top; y <= playIconBounds.bottom; y += 1) {
  for (let x = playIconBounds.left; x <= playIconBounds.right; x += 1) {
    const offset = pixelOffset(x, y);
    const red = source[offset];
    const green = source[offset + 1];
    const blue = source[offset + 2];

    if (blue > 116 && (red > 10 || green > 21)) {
      playIconPixels.add(`${x},${y}`);
    }
  }
}

const playIconEraseMask = new Set();
for (const point of playIconPixels) {
  const [x, y] = point.split(",").map(Number);

  for (let offsetY = -3; offsetY <= 3; offsetY += 1) {
    for (let offsetX = -3; offsetX <= 3; offsetX += 1) {
      playIconEraseMask.add(`${x + offsetX},${y + offsetY}`);
    }
  }
}

for (const point of playIconEraseMask) {
  const [x, y] = point.split(",").map(Number);
  if (
    x < playIconBounds.left ||
    x > playIconBounds.right ||
    y < playIconBounds.top ||
    y > playIconBounds.bottom
  ) {
    continue;
  }

  const targetOffset = pixelOffset(x, y);
  const leftTextureOffset = pixelOffset(1308, y);
  const rightTextureOffset = pixelOffset(1394, y);
  const blend = (x - playIconBounds.left) / (playIconBounds.right - playIconBounds.left);

  for (let channel = 0; channel < 3; channel += 1) {
    pixels[targetOffset + channel] = Math.round(
      source[leftTextureOffset + channel] * (1 - blend) +
        source[rightTextureOffset + channel] * blend,
    );
  }
  pixels[targetOffset + 3] = 255;
}

// Render the exact Chinese copy through the system CJK typeface at a tiny
// logical size, then stamp each glyph pixel as a crisp 2×2 block.
const logicalWidth = 38;
const logicalHeight = 16;
const glyphSvg = Buffer.from(`
  <svg width="${logicalWidth}" height="${logicalHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#000"/>
    <text
      x="1"
      y="13"
      fill="#fff"
      font-family="STHeiti, Heiti SC, sans-serif"
      font-size="13"
      font-weight="700"
      letter-spacing="2"
    >进入</text>
  </svg>
`);

const { data: glyphMask } = await sharp(glyphSvg)
  .greyscale()
  .threshold(96)
  .raw()
  .toBuffer({ resolveWithObject: true });

const logicalPixel = (x, y) => glyphMask[y * logicalWidth + x] > 0;
const originX = 1322;
const originY = 674;
const blockSize = 2;
const screenSlope = 0.035;

const stamp = (x, y, color) => {
  if (x < 0 || x >= info.width || y < 0 || y >= info.height) return;
  const offset = pixelOffset(x, y);
  pixels[offset] = color[0];
  pixels[offset + 1] = color[1];
  pixels[offset + 2] = color[2];
  pixels[offset + 3] = 255;
};

for (let glyphY = 0; glyphY < logicalHeight; glyphY += 1) {
  for (let glyphX = 0; glyphX < logicalWidth; glyphX += 1) {
    if (!logicalPixel(glyphX, glyphY)) continue;

    const x = originX + glyphX * blockSize;
    const y =
      originY +
      glyphY * blockSize +
      Math.round((glyphX * blockSize - logicalWidth) * screenSlope);

    for (let blockY = 0; blockY < blockSize; blockY += 1) {
      for (let blockX = 0; blockX < blockSize; blockX += 1) {
        stamp(x + blockX + 2, y + blockY + 2, [28, 28, 166]);
      }
    }
  }
}

for (let glyphY = 0; glyphY < logicalHeight; glyphY += 1) {
  for (let glyphX = 0; glyphX < logicalWidth; glyphX += 1) {
    if (!logicalPixel(glyphX, glyphY)) continue;

    const x = originX + glyphX * blockSize;
    const y =
      originY +
      glyphY * blockSize +
      Math.round((glyphX * blockSize - logicalWidth) * screenSlope);
    const color = glyphY < 5 ? [146, 139, 255] : [101, 96, 246];

    for (let blockY = 0; blockY < blockSize; blockY += 1) {
      for (let blockX = 0; blockX < blockSize; blockX += 1) {
        stamp(x + blockX, y + blockY, color);
      }
    }
  }
}

await sharp(pixels, {
  raw: {
    width: info.width,
    height: info.height,
    channels,
  },
})
  .webp({ lossless: true })
  .toFile(outputPath);

console.log(`Rendered ${outputPath}`);
