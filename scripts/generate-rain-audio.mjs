import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(scriptsDirectory);
const sourcePath = join(projectRoot, "raining sound effects.mp4");
const outputPath = join(projectRoot, "public/audio/rain-window-loop.m4a");

// The source spends roughly 36 seconds fading in. This later section keeps
// head, body, and tail close in loudness so the repeating seam stays hidden.
const trimStartSeconds = 125;
const loopDurationSeconds = 120;
const crossfadeSeconds = 4;
const targetPeak = 0.88;

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n");
    throw new Error(`${command} failed\n${detail}`);
  }
};

const readPcmWave = (path) => {
  const wav = readFileSync(path);
  if (wav.toString("ascii", 0, 4) !== "RIFF" || wav.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error("Expected a RIFF/WAVE intermediate");
  }

  let offset = 12;
  let format = null;
  let data = null;

  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);

    if (id === "fmt ") {
      format = {
        encoding: wav.readUInt16LE(offset + 8),
        channels: wav.readUInt16LE(offset + 10),
        sampleRate: wav.readUInt32LE(offset + 12),
        bitsPerSample: wav.readUInt16LE(offset + 22),
      };
    } else if (id === "data") {
      data = { offset: offset + 8, size };
      break;
    }

    offset += 8 + size + (size % 2);
  }

  if (
    !format ||
    !data ||
    ![1, 0xfffe].includes(format.encoding) ||
    format.bitsPerSample !== 16 ||
    format.channels !== 2
  ) {
    throw new Error("Expected 16-bit stereo PCM from afconvert");
  }

  return { wav, format, data };
};

const writePcmWave = (path, samples, sampleRate, channels, gain) => {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const wav = Buffer.alloc(44 + dataSize);

  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(channels, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
  wav.writeUInt16LE(channels * bytesPerSample, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < samples.length; index += 1) {
    const value = Math.max(-1, Math.min(1, samples[index] * gain));
    wav.writeInt16LE(Math.round(value * 32767), 44 + index * bytesPerSample);
  }

  writeFileSync(path, wav);
};

if (!existsSync(sourcePath)) {
  throw new Error(`Missing source audio: ${sourcePath}`);
}

const workDirectory = mkdtempSync(join(tmpdir(), "akisy-rain-loop-"));
const trimmedPath = join(workDirectory, "trimmed.m4a");
const decodedPath = join(workDirectory, "trimmed.wav");
const loopWavePath = join(workDirectory, "loop.wav");

try {
  run("/usr/bin/avconvert", [
    "--source",
    sourcePath,
    "--preset",
    "PresetAppleM4A",
    "--output",
    trimmedPath,
    "--start",
    String(trimStartSeconds),
    "--duration",
    String(loopDurationSeconds + crossfadeSeconds),
    "--replace",
  ]);

  run("/usr/bin/afconvert", [
    trimmedPath,
    decodedPath,
    "-f",
    "WAVE",
    "-d",
    "LEI16@44100",
  ]);

  const { wav, format, data } = readPcmWave(decodedPath);
  const { channels, sampleRate } = format;
  const inputFrameCount = Math.floor(data.size / (channels * 2));
  const loopFrameCount = Math.round(loopDurationSeconds * sampleRate);
  const crossfadeFrameCount = Math.round(crossfadeSeconds * sampleRate);

  if (inputFrameCount < loopFrameCount + crossfadeFrameCount) {
    throw new Error(
      `Trimmed source is too short: ${inputFrameCount} frames, expected at least ${
        loopFrameCount + crossfadeFrameCount
      }`,
    );
  }

  const samples = new Float64Array(loopFrameCount * channels);
  let peak = 0;
  let squareSum = 0;

  for (let frame = 0; frame < loopFrameCount; frame += 1) {
    const progress =
      frame < crossfadeFrameCount ? frame / (crossfadeFrameCount - 1) : 1;
    const tailGain = Math.cos((Math.PI * progress) / 2);
    const headGain = Math.sin((Math.PI * progress) / 2);

    for (let channel = 0; channel < channels; channel += 1) {
      const headOffset = data.offset + (frame * channels + channel) * 2;
      const head = wav.readInt16LE(headOffset) / 32768;
      let sample = head;

      if (frame < crossfadeFrameCount) {
        const tailFrame = loopFrameCount + frame;
        const tailOffset = data.offset + (tailFrame * channels + channel) * 2;
        const tail = wav.readInt16LE(tailOffset) / 32768;
        sample = tail * tailGain + head * headGain;
      }

      const index = frame * channels + channel;
      samples[index] = sample;
      peak = Math.max(peak, Math.abs(sample));
      squareSum += sample * sample;
    }
  }

  const gain = peak > 0 ? targetPeak / peak : 1;
  const sourceRms = Math.sqrt(squareSum / samples.length);
  writePcmWave(loopWavePath, samples, sampleRate, channels, gain);

  mkdirSync(dirname(outputPath), { recursive: true });
  rmSync(outputPath, { force: true });
  run("/usr/bin/afconvert", [
    loopWavePath,
    outputPath,
    "-f",
    "m4af",
    "-d",
    "aac",
    "-b",
    "128000",
    "-q",
    "127",
    "-s",
    "2",
    "--no-filler",
  ]);

  const sizeMegabytes = statSync(outputPath).size / 1024 / 1024;
  const rmsDb = sourceRms > 0 ? 20 * Math.log10(sourceRms * gain) : -Infinity;
  console.log(
    [
      `Generated ${outputPath}`,
      `Source start: ${trimStartSeconds}s`,
      `Loop: ${loopDurationSeconds}s with ${crossfadeSeconds}s equal-power crossfade`,
      `Normalized RMS: ${rmsDb.toFixed(1)} dBFS`,
      `Output size: ${sizeMegabytes.toFixed(2)} MB`,
    ].join("\n"),
  );
} finally {
  rmSync(workDirectory, { recursive: true, force: true });
}
