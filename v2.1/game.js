const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timerEl = document.getElementById("timer");
const dashMeter = document.getElementById("dashMeter");
const progressMeter = document.getElementById("progressMeter");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const touchButtons = document.querySelectorAll(".touch-btn");

const W = canvas.width;
const H = canvas.height;
const GRAVITY = 0.72;
const keys = new Set();
const pressed = new Set();

let state;
let last = 0;
let running = false;

const level = {
  width: 4300,
  start: { x: 74, y: 404 },
  platforms: [
    { x: 0, y: 492, w: 720, h: 54, skin: "street" },
    { x: 790, y: 492, w: 440, h: 54, skin: "vinyl" },
    { x: 1320, y: 492, w: 690, h: 54, skin: "street" },
    { x: 2090, y: 492, w: 470, h: 54, skin: "speaker" },
    { x: 2670, y: 492, w: 630, h: 54, skin: "street" },
    { x: 3380, y: 492, w: 920, h: 54, skin: "stage" },
    { x: 330, y: 398, w: 170, h: 24, skin: "neon" },
    { x: 610, y: 344, w: 160, h: 24, skin: "neon" },
    { x: 930, y: 384, w: 160, h: 24, skin: "speaker" },
    { x: 1420, y: 392, w: 160, h: 24, skin: "neon" },
    { x: 1690, y: 322, w: 170, h: 24, skin: "vinyl" },
    { x: 2180, y: 394, w: 170, h: 24, skin: "neon" },
    { x: 2450, y: 322, w: 150, h: 24, skin: "speaker" },
    { x: 2825, y: 386, w: 190, h: 24, skin: "neon" },
    { x: 3140, y: 332, w: 170, h: 24, skin: "vinyl" },
    { x: 3580, y: 384, w: 190, h: 24, skin: "neon" },
    { x: 3890, y: 338, w: 150, h: 24, skin: "speaker" }
  ],
  pickups: [
    [240, 450, "note"], [350, 356, "note"], [430, 356, "note"], [640, 302, "vinyl"], [720, 302, "note"],
    [900, 450, "note"], [1010, 342, "milk"], [1130, 450, "note"], [1440, 350, "note"], [1520, 350, "note"],
    [1715, 280, "key"], [1810, 280, "note"], [1970, 450, "note"], [2220, 352, "note"], [2310, 352, "note"],
    [2475, 280, "vinyl"], [2545, 280, "note"], [2750, 450, "note"], [2860, 344, "milk"], [2960, 344, "note"],
    [3160, 290, "key"], [3260, 290, "note"], [3500, 450, "note"], [3605, 342, "vinyl"], [3710, 342, "note"],
    [3930, 296, "note"], [4000, 296, "note"], [4130, 450, "note"]
  ],
  enemies: [
    { x: 545, y: 454, min: 505, max: 690, type: "camera" },
    { x: 1140, y: 454, min: 860, max: 1180, type: "speaker" },
    { x: 1540, y: 454, min: 1370, max: 1980, type: "camera" },
    { x: 2260, y: 454, min: 2140, max: 2520, type: "light" },
    { x: 2890, y: 454, min: 2700, max: 3260, type: "speaker" },
    { x: 3660, y: 454, min: 3420, max: 3810, type: "camera" }
  ],
  checkpoints: [{ x: 2050 }, { x: 3340 }],
  goal: { x: 4175, y: 250, w: 86, h: 242 }
};

function makeState() {
  return {
    camera: 0,
    score: 0,
    lives: 4,
    time: 150,
    won: false,
    over: false,
    checkpoint: { ...level.start },
    particles: [],
    popups: [],
    hitstop: 0,
    shake: 0,
    flash: 0,
    player: {
      x: level.start.x,
      y: level.start.y,
      w: 34,
      h: 58,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: false,
      coyote: 0,
      jumpBuffer: 0,
      attack: 0,
      attackCd: 0,
      dashEnergy: 100,
      dashCd: 0,
      invincible: 0,
      shield: 0
    },
    pickups: level.pickups.map(([x, y, type]) => ({ x, y, type, taken: false, bob: Math.random() * 9 })),
    enemies: level.enemies.map((e, i) => ({ ...e, w: 40, h: 36, dir: i % 2 ? -1 : 1, alive: true, stun: 0 })),
    checkpoints: level.checkpoints.map((c) => ({ ...c, active: false }))
  };
}

function rects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function startGame() {
  state = makeState();
  running = true;
  last = performance.now();
  overlay.classList.add("hidden");
  requestAnimationFrame(loop);
}

function finish(title, body, button = "再来一局") {
  running = false;
  overlay.querySelector(".mark").textContent = state.won ? "CLEAR" : "V2";
  overlay.querySelector("h1").textContent = title;
  overlay.querySelector("p").textContent = body;
  startBtn.textContent = button;
  overlay.classList.remove("hidden");
}

function loop(now) {
  if (!running) return;
  const dt = Math.min(32, now - last) / 16.67;
  last = now;
  update(dt);
  draw();
  pressed.clear();
  requestAnimationFrame(loop);
}

function update(dt) {
  if (state.hitstop > 0) {
    state.hitstop -= dt;
    draw();
    return;
  }

  const p = state.player;
  state.time -= dt / 60;
  state.shake = Math.max(0, state.shake - dt);
  state.flash = Math.max(0, state.flash - dt);
  p.invincible = Math.max(0, p.invincible - dt);
  p.shield = Math.max(0, p.shield - dt);
  p.attack = Math.max(0, p.attack - dt);
  p.attackCd = Math.max(0, p.attackCd - dt);
  p.dashCd = Math.max(0, p.dashCd - dt);
  p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
  p.coyote = p.onGround ? 8 : Math.max(0, p.coyote - dt);
  p.dashEnergy = Math.min(100, p.dashEnergy + (p.onGround ? 0.72 : 0.38) * dt);

  if (state.time <= 0) hurtPlayer();

  if (pressed.has("ArrowUp") || pressed.has("w") || pressed.has(" ")) p.jumpBuffer = 8;

  const left = keys.has("ArrowLeft") || keys.has("a");
  const right = keys.has("ArrowRight") || keys.has("d");
  const accel = p.onGround ? 0.78 : 0.52;
  const max = p.onGround ? 6.2 : 5.6;
  if (left) {
    p.vx -= accel * dt;
    p.facing = -1;
  }
  if (right) {
    p.vx += accel * dt;
    p.facing = 1;
  }
  if (!left && !right) p.vx *= p.onGround ? 0.78 : 0.93;
  p.vx = clamp(p.vx, -max, max);

  if (p.jumpBuffer > 0 && p.coyote > 0) {
    p.vy = -14.8;
    p.onGround = false;
    p.coyote = 0;
    p.jumpBuffer = 0;
    burst(p.x + p.w / 2, p.y + p.h, "#4de3ff", 8, 1.8);
  }

  const jumpHeld = keys.has("ArrowUp") || keys.has("w") || keys.has(" ");
  if (!jumpHeld && p.vy < -4.2) p.vy += 0.48 * dt;

  const dashPressed = pressed.has("k") || pressed.has("Shift");
  if (dashPressed && p.dashEnergy >= 34 && p.dashCd <= 0) {
    p.vx = p.facing * 13.2;
    p.vy *= 0.35;
    p.dashEnergy -= 34;
    p.dashCd = 20;
    p.invincible = Math.max(p.invincible, 12);
    state.shake = 6;
    burst(p.x + p.w / 2, p.y + 30, "#ffd166", 18, 3.1);
  }

  if ((pressed.has("j") || keys.has("j")) && p.attackCd <= 0) {
    p.attack = 13;
    p.attackCd = 24;
    burst(p.x + p.w / 2 + p.facing * 30, p.y + 28, "#ff5d8f", 8, 2.2);
  }

  p.vy += GRAVITY * dt;
  p.x += p.vx * dt;
  collideX(p);
  p.y += p.vy * dt;
  collideY(p);
  p.x = clamp(p.x, 0, level.width - p.w);

  updateEnemies(dt);
  collectPickups(dt);
  updateCheckpoints();
  updateParticles(dt);

  if (p.y > H + 120) hurtPlayer(true);
  if (rects(p, level.goal)) {
    state.won = true;
    const bonus = Math.ceil(Math.max(0, state.time) / 3);
    state.score += bonus;
    syncHud();
    finish("演唱会开场成功", `V2 通关！音符 ${state.score}，时间奖励 ${bonus}。`, "再开一场");
  }

  state.camera = clamp(p.x - W * 0.36, 0, level.width - W);
  syncHud();
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function collideX(p) {
  for (const b of level.platforms) {
    if (!rects(p, b)) continue;
    if (p.vx > 0) p.x = b.x - p.w;
    if (p.vx < 0) p.x = b.x + b.w;
    p.vx = 0;
  }
}

function collideY(p) {
  p.onGround = false;
  for (const b of level.platforms) {
    if (!rects(p, b)) continue;
    if (p.vy > 0) {
      p.y = b.y - p.h;
      p.vy = 0;
      p.onGround = true;
    } else if (p.vy < 0) {
      p.y = b.y + b.h;
      p.vy = 0;
    }
  }
}

function updateEnemies(dt) {
  const p = state.player;
  const hit = {
    x: p.facing > 0 ? p.x + p.w - 2 : p.x - 48,
    y: p.y + 10,
    w: 50,
    h: 38
  };

  for (const e of state.enemies) {
    if (!e.alive) continue;
    e.stun = Math.max(0, e.stun - dt);
    if (e.stun <= 0) {
      e.x += e.dir * (e.type === "light" ? 1.18 : 1.55) * dt;
      if (e.x < e.min || e.x > e.max) e.dir *= -1;
    }

    if (p.attack > 4 && rects(hit, e)) {
      defeatEnemy(e, "#ff5d8f", 2);
      continue;
    }

    if (!rects(p, e) || p.invincible > 0) continue;
    if (p.vy > 1.2 && p.y + p.h - e.y < 20) {
      p.vy = -10.8;
      defeatEnemy(e, "#4de3ff", 1);
    } else {
      hurtPlayer();
    }
  }
}

function defeatEnemy(e, color, add) {
  e.alive = false;
  state.score += add;
  state.hitstop = 4;
  state.shake = 7;
  burst(e.x + e.w / 2, e.y + e.h / 2, color, 22, 3.4);
  popup(`+${add}`, e.x + e.w / 2, e.y - 8, color);
}

function collectPickups(dt) {
  const p = state.player;
  for (const item of state.pickups) {
    item.bob += dt * 0.08;
    if (item.taken) continue;
    const box = { x: item.x, y: item.y, w: 28, h: 28 };
    if (!rects(p, box)) continue;
    item.taken = true;
    let add = 1;
    let color = "#ffd166";
    if (item.type === "milk") {
      add = 3;
      p.shield = 360;
      p.invincible = Math.max(p.invincible, 50);
      color = "#ffb86b";
    } else if (item.type === "key") {
      add = 4;
      p.vy = Math.min(p.vy, -12);
      color = "#f8f3ff";
    } else if (item.type === "vinyl") {
      add = 5;
      p.dashEnergy = 100;
      color = "#4de3ff";
    }
    state.score += add;
    burst(item.x + 14, item.y + 14, color, 14, 2.6);
    popup(`+${add}`, item.x + 8, item.y - 8, color);
  }
}

function updateCheckpoints() {
  const p = state.player;
  for (const c of state.checkpoints) {
    if (!c.active && p.x > c.x) {
      c.active = true;
      state.checkpoint = { x: c.x, y: 404 };
      state.flash = 18;
      popup("CHECK", c.x, 310, "#4de3ff");
      burst(c.x, 420, "#4de3ff", 24, 3.2);
    }
  }
}

function hurtPlayer(fell = false) {
  const p = state.player;
  if (p.invincible > 0 || state.over || state.won) return;
  if (p.shield > 0 && !fell) {
    p.shield = 0;
    p.invincible = 100;
    p.vx = -p.facing * 6;
    p.vy = -8;
    state.shake = 10;
    burst(p.x + p.w / 2, p.y + 24, "#ffd166", 24, 3.2);
    return;
  }
  state.lives -= 1;
  state.shake = 14;
  if (state.lives <= 0) {
    state.over = true;
    syncHud();
    finish("巡演暂告一段落", `本次收集 ${state.score} 个音符。调整路线后再冲一次。`);
    return;
  }
  Object.assign(p, {
    x: state.checkpoint.x,
    y: state.checkpoint.y,
    vx: 0,
    vy: 0,
    invincible: 130,
    dashEnergy: Math.max(66, p.dashEnergy)
  });
  state.time = Math.max(35, state.time);
  burst(p.x + p.w / 2, p.y + 30, "#ff5d8f", 20, 3);
}

function burst(x, y, color, count, speed) {
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = (0.8 + Math.random()) * speed;
    state.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 0.6,
      life: 32 + Math.random() * 18,
      max: 46,
      size: 2 + Math.random() * 3,
      color
    });
  }
}

function popup(text, x, y, color) {
  state.popups.push({ text, x, y, color, life: 52 });
}

function updateParticles(dt) {
  for (const q of state.particles) {
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.vy += 0.06 * dt;
    q.life -= dt;
  }
  state.particles = state.particles.filter((q) => q.life > 0);
  for (const p of state.popups) {
    p.y -= 0.42 * dt;
    p.life -= dt;
  }
  state.popups = state.popups.filter((p) => p.life > 0);
}

function syncHud() {
  scoreEl.textContent = state.score;
  livesEl.textContent = state.lives;
  timerEl.textContent = Math.max(0, Math.ceil(state.time));
  dashMeter.style.width = `${state.player.dashEnergy}%`;
  progressMeter.style.width = `${clamp((state.player.x / (level.goal.x - 70)) * 100, 0, 100)}%`;
}

function draw() {
  const ox = state.shake ? (Math.random() - 0.5) * state.shake : 0;
  const oy = state.shake ? (Math.random() - 0.5) * state.shake : 0;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.clearRect(-20, -20, W + 40, H + 40);
  drawBackdrop();
  ctx.save();
  ctx.translate(-state.camera, 0);
  drawWorld();
  drawPickups();
  drawEnemies();
  drawGoal();
  drawPlayer();
  drawParticles();
  ctx.restore();
  drawVignette();
  ctx.restore();
}

function drawBackdrop() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#111936");
  g.addColorStop(0.45, "#182545");
  g.addColorStop(1, "#0b0d16");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const moonX = 740 - state.camera * 0.08;
  ctx.fillStyle = "#f7e7a0";
  ctx.beginPath();
  ctx.arc(moonX, 86, 43, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111936";
  ctx.beginPath();
  ctx.arc(moonX + 2, 86, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  for (let i = 0; i < 55; i += 1) {
    const x = (i * 173 - state.camera * 0.16) % (W + 160) - 80;
    const y = 22 + (i * 47) % 190;
    ctx.fillRect(x, y, i % 4 === 0 ? 2 : 1, 1);
  }

  drawCityLayer(0.18, 328, "#12172b", 0.9);
  drawCityLayer(0.33, 384, "#171f38", 1);
  drawLightBeams();
}

function drawCityLayer(speed, base, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 150 - state.camera * speed) % 2850) - 170;
    const h = 80 + (i * 37) % 120;
    ctx.fillRect(x, base - h, 105, h);
    ctx.fillStyle = i % 3 === 0 ? "#ffd166" : "#4de3ff";
    for (let wy = base - h + 18; wy < base - 12; wy += 28) {
      ctx.globalAlpha = 0.18;
      ctx.fillRect(x + 18, wy, 12, 6);
      ctx.fillRect(x + 58, wy + 5, 12, 6);
      ctx.globalAlpha = alpha;
    }
    ctx.fillStyle = color;
  }
  ctx.restore();
}

function drawLightBeams() {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 5; i += 1) {
    const x = ((i * 360 - state.camera * 0.22) % 1500) - 220;
    const grad = ctx.createLinearGradient(x, 160, x + 230, 520);
    grad.addColorStop(0, "rgba(77,227,255,0.12)");
    grad.addColorStop(1, "rgba(255,93,143,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x, 150);
    ctx.lineTo(x + 62, 150);
    ctx.lineTo(x + 260, 540);
    ctx.lineTo(x - 80, 540);
    ctx.fill();
  }
  ctx.restore();
}

function drawWorld() {
  for (let x = -200; x < level.width + 300; x += 180) {
    drawPosterWall(x, 430);
  }
  for (const b of level.platforms) drawPlatform(b);
  for (const c of state.checkpoints) drawCheckpoint(c);
}

function drawPosterWall(x, y) {
  ctx.fillStyle = "#101626";
  ctx.fillRect(x, y, 86, 58);
  ctx.fillStyle = "#242e4a";
  ctx.fillRect(x + 7, y + 8, 72, 42);
  ctx.fillStyle = x % 360 === 0 ? "#ff5d8f" : "#4de3ff";
  ctx.fillRect(x + 14, y + 15, 46, 5);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(x + 14, y + 28, 32, 5);
}

function drawPlatform(b) {
  const top = {
    street: "#2c334e",
    vinyl: "#191825",
    speaker: "#252331",
    neon: "#1b2740",
    stage: "#46312a"
  }[b.skin];
  const edge = b.skin === "neon" ? "#4de3ff" : b.skin === "stage" ? "#ffd166" : "#ff5d8f";
  ctx.fillStyle = "#080a12";
  ctx.fillRect(b.x, b.y + 8, b.w, b.h);
  ctx.fillStyle = top;
  ctx.fillRect(b.x, b.y, b.w, b.h - 10);
  ctx.fillStyle = edge;
  ctx.fillRect(b.x, b.y, b.w, 5);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let x = b.x + 18; x < b.x + b.w; x += 52) {
    ctx.fillRect(x, b.y + 16, 28, 5);
    if (b.skin === "speaker") {
      ctx.strokeStyle = "rgba(77,227,255,0.45)";
      ctx.beginPath();
      ctx.arc(x + 18, b.y + 30, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawCheckpoint(c) {
  ctx.strokeStyle = c.active ? "#ffd166" : "#4de3ff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(c.x, 492);
  ctx.lineTo(c.x, 356);
  ctx.stroke();
  ctx.fillStyle = c.active ? "#ffd166" : "#4de3ff";
  ctx.fillRect(c.x + 4, 360, 70, 28);
  ctx.fillStyle = "#111936";
  ctx.font = "bold 13px Arial";
  ctx.fillText("SAVE", c.x + 17, 379);
  ctx.lineWidth = 1;
}

function drawPickups() {
  for (const item of state.pickups) {
    if (item.taken) continue;
    const y = item.y + Math.sin(item.bob) * 4;
    if (item.type === "note") drawNote(item.x, y, "#ffd166");
    if (item.type === "vinyl") drawVinyl(item.x, y);
    if (item.type === "milk") drawMilkTea(item.x, y);
    if (item.type === "key") drawKey(item.x, y);
  }
}

function drawNote(x, y, color) {
  glow(x + 14, y + 14, color, 18);
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

function drawVinyl(x, y) {
  glow(x + 15, y + 15, "#4de3ff", 20);
  ctx.fillStyle = "#090a10";
  ctx.beginPath();
  ctx.arc(x + 15, y + 15, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4de3ff";
  ctx.stroke();
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(x + 15, y + 15, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawMilkTea(x, y) {
  glow(x + 15, y + 15, "#ffb86b", 18);
  ctx.fillStyle = "#f4c48c";
  ctx.fillRect(x + 7, y + 7, 19, 24);
  ctx.fillStyle = "#fff2d1";
  ctx.fillRect(x + 5, y + 5, 23, 6);
  ctx.fillStyle = "#5b3425";
  ctx.fillRect(x + 11, y + 25, 11, 3);
  ctx.strokeStyle = "#fff2d1";
  ctx.beginPath();
  ctx.moveTo(x + 17, y + 5);
  ctx.lineTo(x + 25, y - 7);
  ctx.stroke();
}

function drawKey(x, y) {
  glow(x + 16, y + 16, "#f8f3ff", 20);
  ctx.fillStyle = "#f8f3ff";
  for (let i = 0; i < 5; i += 1) ctx.fillRect(x + 3 + i * 6, y + 9, 4, 17);
  ctx.fillStyle = "#1b1c28";
  ctx.fillRect(x + 2, y + 7, 31, 5);
}

function glow(x, y, color, r) {
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

function drawEnemies() {
  for (const e of state.enemies) {
    if (!e.alive) continue;
    ctx.save();
    ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
    ctx.scale(e.dir, 1);
    ctx.translate(-e.w / 2, -e.h / 2);
    if (e.type === "camera") drawCameraEnemy();
    if (e.type === "speaker") drawSpeakerEnemy();
    if (e.type === "light") drawLightEnemy();
    ctx.restore();
  }
}

function drawCameraEnemy() {
  ctx.fillStyle = "#191c28";
  ctx.fillRect(5, 11, 28, 20);
  ctx.fillStyle = "#303954";
  ctx.fillRect(0, 17, 9, 12);
  ctx.fillStyle = "#4de3ff";
  ctx.fillRect(12, 4, 16, 9);
  glow(34, 18, "#ff5d8f", 18);
  ctx.fillStyle = "#f8f3ff";
  ctx.fillRect(29, 15, 10, 10);
  ctx.fillStyle = "#090a10";
  ctx.fillRect(32, 18, 4, 4);
}

function drawSpeakerEnemy() {
  ctx.fillStyle = "#1a1825";
  ctx.fillRect(4, 4, 31, 32);
  ctx.strokeStyle = "#ff5d8f";
  ctx.strokeRect(4, 4, 31, 32);
  ctx.strokeStyle = "#4de3ff";
  ctx.beginPath();
  ctx.arc(20, 15, 8, 0, Math.PI * 2);
  ctx.arc(20, 28, 6, 0, Math.PI * 2);
  ctx.stroke();
}

function drawLightEnemy() {
  ctx.fillStyle = "#34313f";
  ctx.fillRect(7, 7, 25, 17);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(12, 0, 15, 8);
  ctx.fillStyle = "#ff5d8f";
  ctx.beginPath();
  ctx.moveTo(19, 24);
  ctx.lineTo(34, 36);
  ctx.lineTo(4, 36);
  ctx.fill();
}

function drawGoal() {
  const g = level.goal;
  ctx.fillStyle = "#090a10";
  ctx.fillRect(g.x, g.y + 16, g.w, g.h - 16);
  ctx.fillStyle = "#4de3ff";
  ctx.fillRect(g.x - 12, g.y + 12, g.w + 24, 9);
  ctx.fillStyle = "#ff5d8f";
  ctx.fillRect(g.x - 4, g.y + 58, g.w + 8, 10);
  ctx.fillStyle = "#ffd166";
  ctx.font = "bold 20px Arial";
  ctx.fillText("LIVE", g.x + 18, g.y + 48);
  ctx.fillStyle = "rgba(255,209,102,0.18)";
  ctx.fillRect(g.x - 50, g.y + 170, g.w + 100, 72);
  for (let i = 0; i < 4; i += 1) {
    glow(g.x + 8 + i * 24, g.y + 94, i % 2 ? "#ff5d8f" : "#4de3ff", 24);
  }
}

function drawPlayer() {
  const p = state.player;
  if (p.invincible > 0 && Math.floor(p.invincible / 5) % 2 === 0) return;
  if (p.shield > 0) {
    ctx.strokeStyle = "rgba(255,209,102,0.85)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + p.h / 2, 36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
  }
  ctx.save();
  ctx.translate(p.x + p.w / 2, p.y);
  ctx.scale(p.facing, 1);
  ctx.translate(-p.w / 2, 0);
  ctx.fillStyle = "#111522";
  ctx.fillRect(7, 20, 22, 31);
  ctx.fillStyle = "#263a62";
  ctx.fillRect(10, 24, 16, 23);
  ctx.fillStyle = "#f0bd91";
  ctx.fillRect(7, 7, 22, 18);
  ctx.fillStyle = "#07080c";
  ctx.fillRect(4, 2, 27, 9);
  ctx.fillRect(1, 8, 11, 5);
  ctx.fillStyle = "#0b0c10";
  ctx.fillRect(9, 13, 19, 5);
  ctx.fillStyle = "#4de3ff";
  ctx.fillRect(22, 14, 4, 2);
  ctx.fillStyle = "#ffd166";
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
    ctx.strokeStyle = "#ff5d8f";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(42, 28, 26, -1.1, 0.85);
    ctx.stroke();
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(38, 22);
    ctx.lineTo(60, 11);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  for (const p of state.popups) {
    ctx.globalAlpha = clamp(p.life / 52, 0, 1);
    ctx.fillStyle = p.color;
    ctx.font = "bold 16px Arial";
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
}

function drawVignette() {
  const g = ctx.createRadialGradient(W / 2, H / 2, 160, W / 2, H / 2, 620);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.38)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  if (state.flash > 0) {
    ctx.globalAlpha = state.flash / 40;
    ctx.fillStyle = "#4de3ff";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}

window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", " ", "a", "d", "w", "j", "k", "r", "Shift"].includes(key)) {
    event.preventDefault();
  }
  if (key === "r") startGame();
  if (!keys.has(key)) pressed.add(key);
  keys.add(key);
});

window.addEventListener("keyup", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  keys.delete(key);
});

startBtn.addEventListener("click", startGame);
touchButtons.forEach((button) => {
  const key = button.dataset.key;
  const down = (event) => {
    event.preventDefault();
    if (!keys.has(key)) pressed.add(key);
    keys.add(key);
  };
  const up = (event) => {
    event.preventDefault();
    keys.delete(key);
  };
  button.addEventListener("pointerdown", down);
  button.addEventListener("pointerup", up);
  button.addEventListener("pointercancel", up);
  button.addEventListener("pointerleave", up);
});

state = makeState();
draw();
syncHud();
