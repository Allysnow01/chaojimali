import { ACTS, COLORS, H, W } from "./config.js?v=3.5";
import { clamp } from "./utils.js?v=3.5";

export function draw(ctx, state, level) {
  const ox = state.shake ? (Math.random() - 0.5) * state.shake : 0;
  const oy = state.shake ? (Math.random() - 0.5) * state.shake : 0;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.clearRect(-20, -20, W + 40, H + 40);
  drawBackdrop(ctx, state);
  ctx.save();
  ctx.translate(-state.camera, 0);
  drawWorld(ctx, state, level);
  drawPickups(ctx, state);
  drawEnemies(ctx, state);
  drawGoal(ctx, level.goal);
  drawPlayer(ctx, state);
  drawParticles(ctx, state);
  ctx.restore();
  drawOverlayFx(ctx, state);
  ctx.restore();
}

function drawBackdrop(ctx, state) {
  const act = ACTS[state.actIndex] || ACTS[0];
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, act.tint);
  g.addColorStop(0.55, "#18223f");
  g.addColorStop(1, "#070812");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const moonX = 720 - state.camera * 0.055;
  ctx.fillStyle = "#f7e7a0";
  ctx.beginPath();
  ctx.arc(moonX, 82, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = act.tint;
  ctx.beginPath();
  ctx.arc(moonX + 2, 82, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  for (let i = 0; i < 75; i += 1) {
    const x = (i * 173 - state.camera * 0.14) % (W + 180) - 90;
    const y = 22 + (i * 47) % 210;
    ctx.fillRect(x, y, i % 4 === 0 ? 2 : 1, 1);
  }
  drawCityLayer(ctx, state, 0.16, 330, "#10162a", 0.86);
  drawCityLayer(ctx, state, 0.31, 386, "#17213d", 1);
  drawLightBeams(ctx, state);
}

function drawCityLayer(ctx, state, speed, base, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let i = 0; i < 22; i += 1) {
    const x = ((i * 150 - state.camera * speed) % 3300) - 190;
    const h = 76 + (i * 39) % 136;
    ctx.fillRect(x, base - h, 106, h);
    ctx.fillStyle = i % 3 === 0 ? COLORS.gold : COLORS.cyan;
    for (let wy = base - h + 18; wy < base - 12; wy += 28) {
      ctx.globalAlpha = 0.16;
      ctx.fillRect(x + 18, wy, 12, 6);
      ctx.fillRect(x + 58, wy + 5, 12, 6);
      ctx.globalAlpha = alpha;
    }
    ctx.fillStyle = color;
  }
  ctx.restore();
}

function drawLightBeams(ctx, state) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 330 - state.camera * 0.22) % 1700) - 240;
    const grad = ctx.createLinearGradient(x, 150, x + 230, 540);
    grad.addColorStop(0, "rgba(85,230,255,0.12)");
    grad.addColorStop(1, "rgba(255,93,143,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x, 150);
    ctx.lineTo(x + 62, 150);
    ctx.lineTo(x + 270, 540);
    ctx.lineTo(x - 90, 540);
    ctx.fill();
  }
  ctx.restore();
}

function drawWorld(ctx, state, level) {
  for (let x = -200; x < level.width + 300; x += 180) drawPoster(ctx, x, 430);
  for (const d of level.decorations) drawDecoration(ctx, d);
  for (const wind of level.winds) drawWind(ctx, wind, state);
  for (const gate of level.beatGates) drawBeatGate(ctx, gate, state);
  for (const h of level.hazards) drawHazard(ctx, h);
  for (const p of level.portals) drawPortal(ctx, p);
  for (const s of level.springs) drawSpring(ctx, s);
  for (const b of level.platforms) drawPlatform(ctx, b);
  for (const m of state.moving) drawPlatform(ctx, m);
  for (const c of state.checkpoints) drawCheckpoint(ctx, c);
}

function drawDecoration(ctx, d) {
  if (d.type === "sign") {
    const color = d.theme === "stage" ? COLORS.gold : d.theme === "porcelain" ? "#8ccfff" : d.theme === "factory" ? "#ff8d5d" : COLORS.cyan;
    ctx.fillStyle = "#121827";
    ctx.fillRect(d.x, d.y, 72, 44);
    ctx.fillStyle = color;
    ctx.fillRect(d.x + 10, d.y + 10, 48, 5);
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(d.x + 10, d.y + 24, 32, 5);
    glow(ctx, d.x + 36, d.y + 22, color, 18);
  } else if (d.type === "koi") {
    ctx.fillStyle = "rgba(140,207,255,0.18)";
    ctx.fillRect(d.x - 30, d.y + 18, 110, 16);
    ctx.fillStyle = COLORS.gold;
    ctx.beginPath();
    ctx.ellipse(d.x, d.y + 20, 16, 7, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.rose;
    ctx.beginPath();
    ctx.moveTo(d.x + 16, d.y + 20);
    ctx.lineTo(d.x + 30, d.y + 12);
    ctx.lineTo(d.x + 28, d.y + 27);
    ctx.fill();
  } else if (d.type === "gear") {
    ctx.strokeStyle = "#ff8d5d";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(d.x, d.y + 25, 18, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 8; i += 1) {
      const a = i * Math.PI / 4;
      ctx.fillStyle = "#ff8d5d";
      ctx.fillRect(d.x + Math.cos(a) * 22 - 3, d.y + 25 + Math.sin(a) * 22 - 3, 6, 6);
    }
    ctx.lineWidth = 1;
  } else if (d.type === "crowd") {
    for (let i = 0; i < 9; i += 1) {
      ctx.fillStyle = i % 2 ? COLORS.cyan : COLORS.rose;
      ctx.fillRect(d.x + i * 10, d.y + (i % 3) * 5, 7, 22);
    }
  } else if (d.type === "antenna") {
    ctx.strokeStyle = COLORS.violet;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y + 60);
    ctx.lineTo(d.x + 20, d.y);
    ctx.lineTo(d.x + 42, d.y + 60);
    ctx.moveTo(d.x + 10, d.y + 30);
    ctx.lineTo(d.x + 34, d.y + 30);
    ctx.stroke();
  }
}

function drawPoster(ctx, x, y) {
  ctx.fillStyle = "#101626";
  ctx.fillRect(x, y, 88, 58);
  ctx.fillStyle = "#242e4a";
  ctx.fillRect(x + 7, y + 8, 74, 42);
  ctx.fillStyle = x % 540 === 0 ? COLORS.rose : COLORS.cyan;
  ctx.fillRect(x + 14, y + 15, 48, 5);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(x + 14, y + 28, 34, 5);
}

function drawPlatform(ctx, b) {
  const palette = {
    street: ["#2c334e", COLORS.rose],
    vinyl: ["#191825", COLORS.cyan],
    speaker: ["#252331", COLORS.rose],
    neon: ["#1b2740", COLORS.cyan],
    roof: ["#20263c", COLORS.violet],
    porcelain: ["#183548", "#8ccfff"],
    cloud: ["#233852", COLORS.mint],
    factory: ["#2a2432", "#ff8d5d"],
    stage: ["#46312a", COLORS.gold],
    moving: ["#1b2438", COLORS.mint]
  }[b.skin] || ["#252b42", COLORS.cyan];
  ctx.fillStyle = "#070912";
  ctx.fillRect(b.x, b.y + 8, b.w, b.h);
  ctx.fillStyle = palette[0];
  ctx.fillRect(b.x, b.y, b.w, b.h - 8);
  ctx.fillStyle = palette[1];
  ctx.fillRect(b.x, b.y, b.w, 5);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let x = b.x + 18; x < b.x + b.w; x += 52) {
    ctx.fillRect(x, b.y + 15, 28, 5);
    if (["speaker", "factory"].includes(b.skin)) {
      ctx.strokeStyle = "rgba(85,230,255,0.45)";
      ctx.beginPath();
      ctx.arc(x + 18, b.y + 30, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawWind(ctx, wind, state) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.22;
  const g = ctx.createLinearGradient(wind.x, wind.y + wind.h, wind.x, wind.y);
  g.addColorStop(0, "rgba(140,255,193,0)");
  g.addColorStop(0.5, "rgba(140,255,193,0.45)");
  g.addColorStop(1, "rgba(85,230,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(wind.x, wind.y, wind.w, wind.h);
  ctx.strokeStyle = COLORS.mint;
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i += 1) {
    const x = wind.x + 18 + i * 22;
    const y = wind.y + wind.h - ((state.pulse * 4 + i * 37) % wind.h);
    ctx.beginPath();
    ctx.moveTo(x, y + 24);
    ctx.quadraticCurveTo(x + 16, y + 8, x + 4, y - 18);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBeatGate(ctx, gate, state) {
  const closed = ((state.pulse + gate.phase) % gate.period) < gate.period * 0.56;
  ctx.save();
  glow(ctx, gate.x + gate.w / 2, gate.y + gate.h / 2, closed ? COLORS.rose : COLORS.mint, 36);
  ctx.fillStyle = closed ? "rgba(255,93,143,0.82)" : "rgba(140,255,193,0.18)";
  ctx.fillRect(gate.x, gate.y, gate.w, gate.h);
  ctx.fillStyle = closed ? "#ffd166" : COLORS.mint;
  for (let y = gate.y + 8; y < gate.y + gate.h - 6; y += 18) {
    ctx.fillRect(gate.x + 6, y, gate.w - 12, 4);
  }
  ctx.restore();
}

function drawHazard(ctx, h) {
  const color = h.type === "water" ? COLORS.cyan : h.type === "laser" ? COLORS.rose : "#11131d";
  glow(ctx, h.x + h.w / 2, h.y, color, 48);
  ctx.fillStyle = color;
  for (let x = h.x; x < h.x + h.w; x += 22) {
    ctx.beginPath();
    ctx.moveTo(x, h.y + h.h);
    ctx.lineTo(x + 11, h.y);
    ctx.lineTo(x + 22, h.y + h.h);
    ctx.fill();
  }
}

function drawSpring(ctx, s) {
  ctx.fillStyle = COLORS.mint;
  ctx.fillRect(s.x, s.y + 18, s.w, 7);
  ctx.strokeStyle = COLORS.mint;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(s.x + 5, s.y + 20);
  ctx.lineTo(s.x + 13, s.y + 8);
  ctx.lineTo(s.x + 21, s.y + 20);
  ctx.lineTo(s.x + 29, s.y + 8);
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawPortal(ctx, p) {
  glow(ctx, p.x + 20, p.y + 33, COLORS.violet, 44);
  ctx.strokeStyle = COLORS.violet;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(p.x + 20, p.y + 33, 18, 31, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawCheckpoint(ctx, c) {
  ctx.strokeStyle = c.active ? COLORS.gold : COLORS.cyan;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(c.x, c.y);
  ctx.lineTo(c.x, c.y - 136);
  ctx.stroke();
  ctx.fillStyle = c.active ? COLORS.gold : COLORS.cyan;
  ctx.fillRect(c.x + 4, c.y - 132, 70, 28);
  ctx.fillStyle = "#111936";
  ctx.font = "bold 13px Arial";
  ctx.fillText("SAVE", c.x + 17, c.y - 113);
  ctx.lineWidth = 1;
}

function drawPickups(ctx, state) {
  for (const item of state.pickups) {
    if (item.taken) continue;
    const y = item.y + Math.sin(item.bob) * 4;
    if (item.type === "note") drawNote(ctx, item.x, y, COLORS.gold);
    if (item.type === "vinyl") drawVinyl(ctx, item.x, y);
    if (item.type === "milk") drawMilk(ctx, item.x, y);
    if (item.type === "cassette") drawCassette(ctx, item.x, y);
    if (item.type === "feather") drawFeather(ctx, item.x, y);
    if (item.type === "fever") drawStar(ctx, item.x, y);
    if (item.type === "glove") drawGlove(ctx, item.x, y);
  }
}

function drawNote(ctx, x, y, color) {
  glow(ctx, x + 14, y + 14, color, 18);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x + 9, y + 19, 8, 6, -0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x + 16, y + 4, 4, 18);
  ctx.beginPath();
  ctx.arc(x + 24, y + 8, 8, 0.15, Math.PI * 1.15);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawVinyl(ctx, x, y) {
  glow(ctx, x + 15, y + 15, COLORS.cyan, 20);
  ctx.fillStyle = "#090a10";
  ctx.beginPath();
  ctx.arc(x + 15, y + 15, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.cyan;
  ctx.stroke();
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.arc(x + 15, y + 15, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawMilk(ctx, x, y) {
  glow(ctx, x + 15, y + 15, "#ffb86b", 18);
  ctx.fillStyle = "#f4c48c";
  ctx.fillRect(x + 7, y + 7, 19, 24);
  ctx.fillStyle = "#fff2d1";
  ctx.fillRect(x + 5, y + 5, 23, 6);
  ctx.fillStyle = "#5b3425";
  ctx.fillRect(x + 11, y + 25, 11, 3);
}

function drawCassette(ctx, x, y) {
  glow(ctx, x + 15, y + 15, "#f8f3ff", 20);
  ctx.fillStyle = "#f8f3ff";
  ctx.fillRect(x + 3, y + 8, 28, 18);
  ctx.fillStyle = "#151827";
  ctx.fillRect(x + 8, y + 13, 18, 8);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(x + 6, y + 5, 22, 4);
}

function drawFeather(ctx, x, y) {
  glow(ctx, x + 14, y + 14, COLORS.violet, 20);
  ctx.fillStyle = COLORS.violet;
  ctx.beginPath();
  ctx.ellipse(x + 16, y + 15, 7, 18, 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(x + 9, y + 27);
  ctx.lineTo(x + 23, y + 4);
  ctx.stroke();
}

function drawStar(ctx, x, y) {
  glow(ctx, x + 15, y + 15, COLORS.gold, 25);
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 ? 7 : 15;
    const a = -Math.PI / 2 + i * Math.PI / 5;
    ctx.lineTo(x + 15 + Math.cos(a) * r, y + 15 + Math.sin(a) * r);
  }
  ctx.fill();
}

function drawGlove(ctx, x, y) {
  glow(ctx, x + 15, y + 15, COLORS.rose, 20);
  ctx.fillStyle = COLORS.rose;
  ctx.fillRect(x + 8, y + 12, 17, 16);
  for (let i = 0; i < 4; i += 1) ctx.fillRect(x + 6 + i * 5, y + 5, 4, 12);
}

function drawEnemies(ctx, state) {
  for (const e of state.enemies) {
    if (!e.alive) continue;
    ctx.save();
    ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
    ctx.scale(e.dir, 1);
    ctx.translate(-e.w / 2, -e.h / 2);
    if (e.type === "camera") drawCamera(ctx);
    else if (e.type === "speaker") drawSpeaker(ctx);
    else if (e.type === "light") drawLight(ctx);
    else if (e.type === "drone") drawDrone(ctx);
    else if (e.type === "dancer") drawDancer(ctx);
    else if (e.type === "laser") drawLaser(ctx);
    else if (e.type === "spark") drawSpark(ctx);
    else drawFan(ctx);
    ctx.restore();
  }
}

function drawCamera(ctx) {
  ctx.fillStyle = "#191c28";
  ctx.fillRect(5, 11, 28, 20);
  ctx.fillStyle = "#303954";
  ctx.fillRect(0, 17, 9, 12);
  ctx.fillStyle = COLORS.cyan;
  ctx.fillRect(12, 4, 16, 9);
  glow(ctx, 34, 18, COLORS.rose, 18);
  ctx.fillStyle = "#f8f3ff";
  ctx.fillRect(29, 15, 10, 10);
}

function drawSpeaker(ctx) {
  ctx.fillStyle = "#1a1825";
  ctx.fillRect(4, 4, 31, 32);
  ctx.strokeStyle = COLORS.rose;
  ctx.strokeRect(4, 4, 31, 32);
  ctx.strokeStyle = COLORS.cyan;
  ctx.beginPath();
  ctx.arc(20, 15, 8, 0, Math.PI * 2);
  ctx.arc(20, 28, 6, 0, Math.PI * 2);
  ctx.stroke();
}

function drawLight(ctx) {
  ctx.fillStyle = "#34313f";
  ctx.fillRect(7, 7, 25, 17);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(12, 0, 15, 8);
  ctx.fillStyle = COLORS.rose;
  ctx.beginPath();
  ctx.moveTo(19, 24);
  ctx.lineTo(34, 36);
  ctx.lineTo(4, 36);
  ctx.fill();
}

function drawDrone(ctx) {
  ctx.fillStyle = "#262d44";
  ctx.fillRect(9, 11, 24, 16);
  ctx.fillStyle = COLORS.cyan;
  ctx.fillRect(16, 16, 10, 5);
  ctx.strokeStyle = COLORS.violet;
  ctx.beginPath();
  ctx.moveTo(9, 12);
  ctx.lineTo(0, 6);
  ctx.moveTo(33, 12);
  ctx.lineTo(42, 6);
  ctx.stroke();
}

function drawDancer(ctx) {
  ctx.fillStyle = "#f0bd91";
  ctx.fillRect(13, 4, 15, 14);
  ctx.fillStyle = COLORS.violet;
  ctx.fillRect(10, 18, 20, 18);
  ctx.fillStyle = "#07080c";
  ctx.fillRect(9, 2, 21, 6);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(30, 17, 10, 5);
}

function drawLaser(ctx) {
  ctx.fillStyle = "#261b28";
  ctx.fillRect(5, 7, 30, 24);
  ctx.fillStyle = COLORS.rose;
  ctx.fillRect(34, 15, 8, 8);
  glow(ctx, 42, 19, COLORS.rose, 20);
}

function drawSpark(ctx) {
  glow(ctx, 9, 9, COLORS.rose, 18);
  ctx.fillStyle = COLORS.rose;
  ctx.fillRect(4, 4, 10, 10);
}

function drawFan(ctx) {
  ctx.fillStyle = "#202435";
  ctx.fillRect(8, 10, 24, 23);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(5, 5, 26, 7);
  ctx.fillStyle = COLORS.cyan;
  ctx.fillRect(27, 18, 10, 5);
}

function drawGoal(ctx, g) {
  ctx.fillStyle = "#090a10";
  ctx.fillRect(g.x, g.y + 16, g.w, g.h - 16);
  ctx.fillStyle = COLORS.cyan;
  ctx.fillRect(g.x - 14, g.y + 12, g.w + 28, 9);
  ctx.fillStyle = COLORS.rose;
  ctx.fillRect(g.x - 6, g.y + 58, g.w + 12, 10);
  ctx.fillStyle = COLORS.gold;
  ctx.font = "bold 22px Arial";
  ctx.fillText("WORLD", g.x + 20, g.y + 48);
  ctx.fillText("LIVE", g.x + 36, g.y + 86);
  for (let i = 0; i < 5; i += 1) glow(ctx, g.x + 12 + i * 24, g.y + 120, i % 2 ? COLORS.rose : COLORS.cyan, 28);
}

function drawPlayer(ctx, state) {
  const p = state.player;
  if (p.invincible > 0 && Math.floor(p.invincible / 5) % 2 === 0) return;
  if (p.shield > 0) ring(ctx, p.x + p.w / 2, p.y + p.h / 2, COLORS.gold, 36);
  if (p.glide > 0 && !p.onGround) ring(ctx, p.x + p.w / 2, p.y + 34, COLORS.violet, 30);
  if (state.feverActive > 0) ring(ctx, p.x + p.w / 2, p.y + p.h / 2, COLORS.rose, 42);

  ctx.save();
  ctx.translate(p.x + p.w / 2, p.y);
  ctx.scale(p.facing, 1);
  ctx.translate(-p.w / 2, 0);
  ctx.fillStyle = "#111522";
  ctx.fillRect(7, 20, 22, 31);
  ctx.fillStyle = state.feverActive > 0 ? COLORS.rose : "#263a62";
  ctx.fillRect(10, 24, 16, 23);
  ctx.fillStyle = "#f0bd91";
  ctx.fillRect(7, 7, 22, 18);
  ctx.fillStyle = "#07080c";
  ctx.fillRect(4, 2, 27, 9);
  ctx.fillRect(1, 8, 11, 5);
  ctx.fillStyle = "#0b0c10";
  ctx.fillRect(9, 13, 19, 5);
  ctx.fillStyle = COLORS.cyan;
  ctx.fillRect(22, 14, 4, 2);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(13, 24, 4, 15);
  ctx.fillStyle = "#2b1b18";
  ctx.fillRect(7, 50, 9, 8);
  ctx.fillRect(23, 50, 9, 8);
  ctx.strokeStyle = "#6b3d24";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(27, 27);
  ctx.lineTo(45, 18);
  ctx.stroke();
  if (p.attack > 0) {
    ctx.strokeStyle = p.power > 0 ? COLORS.gold : COLORS.rose;
    ctx.lineWidth = p.power > 0 ? 8 : 6;
    ctx.beginPath();
    ctx.arc(42, 28, p.power > 0 ? 34 : 26, -1.1, 0.85);
    ctx.stroke();
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(38, 22);
    ctx.lineTo(62, 11);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticles(ctx, state) {
  for (const p of state.particles) {
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  for (const p of state.popups) {
    ctx.globalAlpha = clamp(p.life / 58, 0, 1);
    ctx.fillStyle = p.color;
    ctx.font = "bold 16px Arial";
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
}

function drawOverlayFx(ctx, state) {
  const g = ctx.createRadialGradient(W / 2, H / 2, 160, W / 2, H / 2, 620);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.38)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  if (state.flash > 0) {
    ctx.globalAlpha = state.flash / 40;
    ctx.fillStyle = state.feverActive > 0 ? COLORS.gold : COLORS.cyan;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
  if (state.remix > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.16 + Math.sin(state.pulse * 0.14) * 0.04;
    for (let x = -40; x < W + 80; x += 42) {
      ctx.fillStyle = x % 84 === 0 ? COLORS.rose : COLORS.cyan;
      ctx.fillRect(x + Math.sin(state.pulse * 0.06 + x) * 12, 0, 5, H);
    }
    ctx.restore();
  }
}

function glow(ctx, x, y, color, r) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = 0.26;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function ring(ctx, x, y, color, r) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1;
}
