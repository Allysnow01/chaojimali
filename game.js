const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const timerEl = document.getElementById("timer");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const touchButtons = document.querySelectorAll(".touch-btn");

const W = canvas.width;
const H = canvas.height;
const GROUND = 472;
const GRAVITY = 0.72;
const FRICTION = 0.83;
const keys = new Set();

let state;
let last = 0;
let running = false;

const level = {
  width: 3600,
  platforms: [
    { x: 0, y: 500, w: 980, h: 56 },
    { x: 1040, y: 500, w: 440, h: 56 },
    { x: 1570, y: 500, w: 760, h: 56 },
    { x: 2400, y: 500, w: 1200, h: 56 },
    { x: 390, y: 392, w: 180, h: 22 },
    { x: 720, y: 333, w: 150, h: 22 },
    { x: 1180, y: 384, w: 180, h: 22 },
    { x: 1680, y: 370, w: 170, h: 22 },
    { x: 1980, y: 310, w: 190, h: 22 },
    { x: 2600, y: 374, w: 210, h: 22 },
    { x: 2940, y: 326, w: 190, h: 22 }
  ],
  notes: [
    [270, 438], [440, 350], [520, 350], [760, 292], [830, 292],
    [1150, 450], [1230, 342], [1320, 342], [1705, 328], [1810, 328],
    [2020, 268], [2110, 268], [2470, 450], [2670, 332], [2760, 332],
    [2980, 284], [3070, 284], [3300, 450], [3380, 450]
  ],
  enemies: [
    { x: 610, y: 456, min: 590, max: 890, dir: 1 },
    { x: 1300, y: 456, min: 1160, max: 1450, dir: -1 },
    { x: 1800, y: 456, min: 1600, max: 2290, dir: 1 },
    { x: 2710, y: 456, min: 2460, max: 2880, dir: -1 },
    { x: 3230, y: 456, min: 3020, max: 3490, dir: 1 }
  ],
  powerups: [
    { x: 920, y: 456, type: "milkTea" },
    { x: 2210, y: 268, type: "piano" }
  ],
  flag: { x: 3485, y: 280, w: 42, h: 220 }
};

function newState() {
  return {
    camera: 0,
    score: 0,
    lives: 3,
    time: 120,
    won: false,
    over: false,
    invincible: 0,
    attack: 0,
    player: {
      x: 72,
      y: 410,
      w: 34,
      h: 54,
      vx: 0,
      vy: 0,
      onGround: false,
      facing: 1
    },
    notes: level.notes.map(([x, y]) => ({ x, y, taken: false })),
    enemies: level.enemies.map((e) => ({ ...e, w: 38, h: 34, alive: true })),
    powerups: level.powerups.map((p) => ({ ...p, w: 32, h: 32, taken: false }))
  };
}

function rects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function startGame() {
  state = newState();
  running = true;
  last = performance.now();
  overlay.classList.add("hidden");
  requestAnimationFrame(loop);
}

function finish(message, button = "再来一局") {
  running = false;
  overlay.querySelector("h1").textContent = message;
  overlay.querySelector("p").textContent = `本次收集 ${state.score} 个音符。继续练级，冲更高分。`;
  startBtn.textContent = button;
  overlay.classList.remove("hidden");
}

function loop(now) {
  if (!running) return;
  const dt = Math.min(32, now - last) / 16.67;
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function update(dt) {
  const p = state.player;
  state.time -= dt / 60;
  state.invincible = Math.max(0, state.invincible - dt);
  state.attack = Math.max(0, state.attack - dt);

  if (state.time <= 0) loseLife();

  const left = keys.has("ArrowLeft") || keys.has("a");
  const right = keys.has("ArrowRight") || keys.has("d");
  if (left) {
    p.vx -= 0.64 * dt;
    p.facing = -1;
  }
  if (right) {
    p.vx += 0.64 * dt;
    p.facing = 1;
  }
  p.vx = Math.max(-5.4, Math.min(5.4, p.vx));
  p.vx *= FRICTION;

  if ((keys.has("ArrowUp") || keys.has("w") || keys.has(" ")) && p.onGround) {
    p.vy = -14.5;
    p.onGround = false;
  }
  if (keys.has("j") && state.attack <= 0) state.attack = 14;

  p.vy += GRAVITY * dt;
  p.x += p.vx * dt;
  collideX(p);
  p.y += p.vy * dt;
  collideY(p);
  p.x = Math.max(0, Math.min(level.width - p.w, p.x));

  if (p.y > H + 100) loseLife();

  updateEnemies(dt);
  collectItems();

  if (state.attack > 6) {
    const hit = { x: p.facing > 0 ? p.x + p.w : p.x - 30, y: p.y + 16, w: 30, h: 20 };
    state.enemies.forEach((e) => {
      if (e.alive && rects(hit, e)) {
        e.alive = false;
        state.score += 2;
      }
    });
  }

  if (rects(p, level.flag)) {
    state.won = true;
    state.score += Math.max(0, Math.ceil(state.time / 5));
    syncHud();
    finish("演唱会开场成功");
  }

  state.camera = Math.max(0, Math.min(level.width - W, p.x - W * 0.38));
  syncHud();
}

function collideX(p) {
  level.platforms.forEach((b) => {
    if (!rects(p, b)) return;
    if (p.vx > 0) p.x = b.x - p.w;
    if (p.vx < 0) p.x = b.x + b.w;
    p.vx = 0;
  });
}

function collideY(p) {
  p.onGround = false;
  level.platforms.forEach((b) => {
    if (!rects(p, b)) return;
    if (p.vy > 0) {
      p.y = b.y - p.h;
      p.vy = 0;
      p.onGround = true;
    } else if (p.vy < 0) {
      p.y = b.y + b.h;
      p.vy = 0;
    }
  });
}

function updateEnemies(dt) {
  state.enemies.forEach((e) => {
    if (!e.alive) return;
    e.x += e.dir * 1.55 * dt;
    if (e.x < e.min || e.x > e.max) e.dir *= -1;
    const p = state.player;
    if (!rects(p, e) || state.invincible > 0) return;
    if (p.vy > 1 && p.y + p.h - e.y < 20) {
      e.alive = false;
      p.vy = -9;
      state.score += 1;
    } else {
      loseLife();
    }
  });
}

function collectItems() {
  const p = state.player;
  state.notes.forEach((n) => {
    if (!n.taken && rects(p, { x: n.x, y: n.y, w: 22, h: 22 })) {
      n.taken = true;
      state.score += 1;
    }
  });
  state.powerups.forEach((u) => {
    if (!u.taken && rects(p, u)) {
      u.taken = true;
      state.score += u.type === "piano" ? 5 : 3;
      state.invincible = u.type === "piano" ? 420 : 180;
    }
  });
}

function loseLife() {
  if (state.invincible > 0 || state.over || state.won) return;
  state.lives -= 1;
  if (state.lives <= 0) {
    state.over = true;
    syncHud();
    finish("巡演暂告一段落");
    return;
  }
  Object.assign(state.player, { x: Math.max(72, state.player.x - 260), y: 390, vx: 0, vy: 0 });
  state.invincible = 120;
  state.time = Math.max(30, state.time);
}

function syncHud() {
  scoreEl.textContent = state.score;
  livesEl.textContent = state.lives;
  timerEl.textContent = Math.max(0, Math.ceil(state.time));
}

function sx(x) {
  return Math.round(x - state.camera);
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  drawSky();
  ctx.save();
  ctx.translate(-state.camera, 0);
  drawWorld();
  drawItems();
  drawEnemies();
  drawFlag();
  drawPlayer();
  ctx.restore();
}

function drawSky() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#86d5e8");
  grad.addColorStop(0.62, "#bdecc9");
  grad.addColorStop(1, "#5ba35d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255,255,255,0.88)";
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 260 - state.camera * 0.25) % 1120) - 80;
    const y = 60 + (i % 3) * 42;
    cloud(x, y, 44 + (i % 2) * 12);
  }

  ctx.fillStyle = "#6f5b54";
  for (let i = 0; i < 9; i += 1) {
    const x = ((i * 360 - state.camera * 0.45) % 1300) - 120;
    ctx.beginPath();
    ctx.moveTo(x, 500);
    ctx.lineTo(x + 170, 255 + (i % 3) * 30);
    ctx.lineTo(x + 350, 500);
    ctx.fill();
  }
}

function cloud(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
  ctx.arc(x + r * 0.55, y - r * 0.2, r * 0.72, 0, Math.PI * 2);
  ctx.arc(x + r * 1.14, y, r * 0.56, 0, Math.PI * 2);
  ctx.fill();
}

function drawWorld() {
  level.platforms.forEach((b) => {
    ctx.fillStyle = b.y >= 500 ? "#724b2a" : "#966334";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = b.y >= 500 ? "#54a74e" : "#6dc35b";
    ctx.fillRect(b.x, b.y, b.w, 14);
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    for (let x = b.x; x < b.x + b.w; x += 40) {
      ctx.strokeRect(x, b.y + 14, 40, b.h - 14);
    }
  });

  for (let x = 190; x < level.width; x += 420) {
    ctx.fillStyle = "#2e8b57";
    ctx.fillRect(x, 430, 16, 70);
    ctx.fillStyle = "#e0b94d";
    ctx.fillRect(x - 18, 414, 52, 18);
    ctx.fillStyle = "#425d7c";
    ctx.fillRect(x - 4, 382, 24, 32);
    ctx.fillStyle = "#f8f0ce";
    ctx.fillRect(x + 2, 388, 12, 12);
  }
}

function drawItems() {
  state.notes.forEach((n) => {
    if (n.taken) return;
    ctx.fillStyle = "#f6ce46";
    ctx.beginPath();
    ctx.ellipse(n.x + 9, n.y + 15, 8, 6, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(n.x + 15, n.y, 4, 18);
    ctx.beginPath();
    ctx.arc(n.x + 22, n.y + 4, 7, 0.2, Math.PI * 1.15);
    ctx.strokeStyle = "#f6ce46";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.lineWidth = 1;
  });

  state.powerups.forEach((u) => {
    if (u.taken) return;
    if (u.type === "milkTea") {
      ctx.fillStyle = "#dfb882";
      ctx.fillRect(u.x + 6, u.y + 5, 20, 25);
      ctx.fillStyle = "#76492e";
      ctx.fillRect(u.x + 9, u.y + 22, 14, 3);
      ctx.strokeStyle = "#26221e";
      ctx.beginPath();
      ctx.moveTo(u.x + 17, u.y + 5);
      ctx.lineTo(u.x + 24, u.y - 8);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#262829";
      ctx.fillRect(u.x, u.y + 7, 34, 19);
      ctx.fillStyle = "#f4f1df";
      for (let i = 3; i < 30; i += 6) ctx.fillRect(u.x + i, u.y + 9, 4, 14);
    }
  });
}

function drawEnemies() {
  state.enemies.forEach((e) => {
    if (!e.alive) return;
    ctx.fillStyle = "#303133";
    ctx.fillRect(e.x + 4, e.y + 7, 28, 22);
    ctx.fillStyle = "#47515c";
    ctx.fillRect(e.x, e.y + 14, 10, 14);
    ctx.fillStyle = "#fbf3d0";
    ctx.fillRect(e.x + 28, e.y + 11, 10, 10);
    ctx.fillStyle = "#55afe1";
    ctx.fillRect(e.x + 11, e.y, 15, 10);
    ctx.fillStyle = "#111";
    ctx.fillRect(e.x + 30, e.y + 14, 4, 4);
  });
}

function drawFlag() {
  const f = level.flag;
  ctx.fillStyle = "#312d2a";
  ctx.fillRect(f.x, f.y, 8, f.h);
  ctx.fillStyle = "#d9514e";
  ctx.fillRect(f.x + 8, f.y + 12, 86, 44);
  ctx.fillStyle = "#f4c542";
  ctx.font = "bold 18px Arial";
  ctx.fillText("LIVE", f.x + 24, f.y + 41);
  ctx.fillStyle = "#262829";
  ctx.fillRect(f.x - 36, f.y + f.h - 6, 90, 16);
}

function drawPlayer() {
  const p = state.player;
  const flash = state.invincible > 0 && Math.floor(state.invincible / 6) % 2 === 0;
  if (flash) return;

  ctx.save();
  ctx.translate(p.x + p.w / 2, p.y);
  ctx.scale(p.facing, 1);
  ctx.translate(-p.w / 2, 0);

  ctx.fillStyle = state.invincible > 0 ? "#f4c542" : "#1f2a36";
  ctx.fillRect(9, 20, 18, 27);
  ctx.fillStyle = "#f0c49a";
  ctx.fillRect(7, 7, 21, 18);
  ctx.fillStyle = "#191715";
  ctx.fillRect(5, 2, 25, 10);
  ctx.fillRect(2, 8, 10, 5);
  ctx.fillStyle = "#0e0d0d";
  ctx.fillRect(22, 13, 3, 3);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(8, 15, 10, 3);
  ctx.fillStyle = "#623b26";
  ctx.fillRect(7, 47, 8, 7);
  ctx.fillRect(22, 47, 8, 7);

  ctx.strokeStyle = "#5b351f";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(26, 25);
  ctx.lineTo(44, 15);
  ctx.stroke();
  ctx.lineWidth = 1;
  if (state.attack > 0) {
    ctx.strokeStyle = "#f4c542";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(40, 23, 24, -0.9, 0.8);
    ctx.stroke();
    ctx.lineWidth = 1;
  }
  ctx.restore();
}

window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", " ", "a", "d", "w", "j", "r"].includes(key)) {
    event.preventDefault();
  }
  if (key === "r") startGame();
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
    keys.add(key);
    if (key === "j" && state.attack <= 0) state.attack = 14;
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
state = newState();
draw();
syncHud();
