export function createAudio() {
  let ctx;
  let master;
  let musicGain;
  let started = false;
  let step = 0;
  let timer = 0;

  const themes = [
    { lead: [392, 440, 523, 493, 440, 392, 330, 392], bass: [196, 196, 165, 196], wave: "triangle" },
    { lead: [330, 392, 494, 440, 392, 330, 294, 330], bass: [165, 147, 196, 165], wave: "sine" },
    { lead: [392, 523, 587, 659, 587, 523, 440, 392], bass: [196, 220, 262, 220], wave: "triangle" },
    { lead: [523, 587, 659, 784, 659, 587, 523, 440], bass: [262, 220, 196, 262], wave: "square" },
    { lead: [196, 262, 294, 392, 294, 262, 196, 147], bass: [98, 131, 147, 98], wave: "sawtooth" },
    { lead: [440, 523, 659, 784, 880, 784, 659, 523], bass: [220, 196, 262, 294], wave: "triangle" }
  ];

  function ensure() {
    if (ctx) return;
    ctx = new AudioContext();
    master = ctx.createGain();
    musicGain = ctx.createGain();
    master.gain.value = 0.18;
    musicGain.gain.value = 0.16;
    musicGain.connect(master);
    master.connect(ctx.destination);
  }

  function start() {
    ensure();
    if (ctx.state === "suspended") ctx.resume();
    started = true;
  }

  function tick(actIndex = 0, feverActive = false, remix = false) {
    if (!started || !ctx) return;
    timer += 1;
    const rate = feverActive || remix ? 9 : 15;
    if (timer % rate !== 0) return;
    const now = ctx.currentTime;
    const theme = themes[actIndex % themes.length];
    const note = theme.lead[(step * 2 + (step >> 2)) % theme.lead.length] * (step % 7 === 0 ? 2 : 1);
    tone(note, remix ? 0.06 : 0.09, theme.wave, feverActive ? 0.052 : 0.037, now, musicGain);
    if (step % 4 === 0) tone(theme.bass[(step / 4) % theme.bass.length | 0], 0.17, "sine", 0.055, now, musicGain);
    if (step % 8 === 6) noise(0.035, 0.025, now, musicGain);
    step += 1;
  }

  function sfx(name) {
    ensure();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    if (name === "jump") tone(520, 0.08, "square", 0.08, now);
    if (name === "dash") sweep(260, 780, 0.12, "sawtooth", 0.11, now);
    if (name === "attack") sweep(720, 190, 0.08, "triangle", 0.09, now);
    if (name === "pickup") {
      tone(660, 0.06, "triangle", 0.07, now);
      tone(990, 0.05, "triangle", 0.045, now + 0.045);
    }
    if (name === "hurt") sweep(240, 90, 0.22, "sawtooth", 0.12, now);
    if (name === "checkpoint") {
      tone(520, 0.08, "triangle", 0.08, now);
      tone(780, 0.08, "triangle", 0.08, now + 0.08);
      tone(1040, 0.12, "triangle", 0.08, now + 0.16);
    }
    if (name === "fever") {
      const fanfare = [392, 494, 587, 784, 988, 1175, 1319, 1568];
      for (let i = 0; i < fanfare.length; i += 1) tone(fanfare[i], 0.08, "square", 0.05, now + i * 0.045);
    }
    if (name === "win") {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, "triangle", 0.07, now + i * 0.12));
    }
    if (name === "spring") sweep(360, 980, 0.1, "sine", 0.1, now);
    if (name === "portal") sweep(180, 880, 0.18, "triangle", 0.09, now);
  }

  function tone(freq, dur, type, vol, when = ctx.currentTime, out = master) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(vol, when + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(gain);
    gain.connect(out);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  function sweep(from, to, dur, type, vol, when) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, when);
    osc.frequency.exponentialRampToValueAtTime(to, when + dur);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(vol, when + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  function noise(dur, vol, when, out = master) {
    const length = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, when);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    src.buffer = buffer;
    src.connect(gain);
    gain.connect(out);
    src.start(when);
  }

  return { start, tick, sfx };
}
