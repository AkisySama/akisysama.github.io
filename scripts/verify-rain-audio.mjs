import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const intro = readFileSync(new URL("../src/components/IntroSequence.astro", import.meta.url), "utf8");
const playback = intro.slice(intro.indexOf("    const prepareRainSound ="), intro.indexOf("    const syncRainSound ="));

async function verify(mobile, rejectResume = false) {
  let gain;
  let connections = 0;
  let starts = 0;
  let frame;
  let state;
  const audio = {
    paused: true,
    // Model iOS: assigning media volume has no effect.
    get volume() { return 1; },
    set volume(_) {},
    play() {
      assert.equal(connections, 2, "Route audio through gain before playback");
      assert.equal(gain.gain.value, 0, "Playback must start silent");
      this.paused = false;
      return Promise.resolve();
    },
    pause() { this.paused = true; },
  };
  class AudioContext {
    constructor() { starts++; }
    createMediaElementSource() { return { connect() { connections++; } }; }
    createGain() {
      gain = { gain: { value: 1 }, connect() { connections++; } };
      return gain;
    }
    resume() { return rejectResume ? Promise.reject(new Error("Blocked")) : Promise.resolve(); }
  }
  const api = runInNewContext(`
    let soundContext = null, soundSource = null, soundGain = null;
    let soundFadeFrame = 0, soundPlayAttempt = 0, soundUnlocked = false;
    let disposed = false, soundDesired = true, introAudible = true, documentVisible = true;
    const soundControlAvailable = () => true;
    ${playback}
    ({ startRainSound, pauseRainSound });
  `, {
    AudioContext,
    window: { cancelAnimationFrame() { frame = null; } },
    rainAudio: audio,
    mobileAudioQuery: { matches: mobile },
    performance: { now: () => 0 },
    requestAnimationFrame(callback) { frame = callback; return 1; },
    setRainSoundState(value) { state = value; },
  });
  await api.startRainSound();
  if (rejectResume) {
    assert.equal(state, "wait");
    assert.equal(audio.paused, true);
    assert.equal(gain.gain.value, 0);
    return;
  }
  frame(600);
  assert.equal(gain.gain.value, mobile ? 0.03 : 0.171);
  assert.equal(state, "on");
  api.pauseRainSound();
  frame(600);
  assert.equal(gain.gain.value, 0);
  assert.equal(audio.paused, true);
  await api.startRainSound();
  assert.equal(starts, 1, "Reuse the media source and audio context on replay");
  api.pauseRainSound(true);
  assert.equal(gain.gain.value, 0);
  assert.equal(audio.paused, true);
}

await verify(true);
await verify(false);
await verify(true, true);
console.log("Verified rain gain with iOS-style fixed media volume, fades, replay, and blocked audio.");
