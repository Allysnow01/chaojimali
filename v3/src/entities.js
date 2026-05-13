import { H, PHYSICS } from "./config.js?v=3.11";
import { clamp, rects } from "./utils.js?v=3.11";

const PICKUP_SCORE = {
  note: 1,
  vinyl: 5,
  milk: 4,
  cassette: 8,
  feather: 6,
  fever: 7,
  glove: 6,
  key: 10
};

export function makeState(level) {
  return {
    camera: 0,
    score: 0,
    lives: 5,
    time: level.stage?.time || 300,
    combo: 1,
    comboTime: 0,
    fever: 20,
    feverActive: 0,
    keys: 0,
    remix: 0,
    safetyBounce: 1,
    won: false,
    over: false,
    checkpoint: { ...level.start },
    checkpointGrace: 0,
    respawnFreeze: 0,
    actIndex: 0,
    particles: [],
    popups: [],
    hitstop: 0,
    shake: 0,
    flash: 0,
    pulse: 0,
    portalCd: 0,
    player: {
      x: level.start.x,
      y: level.start.y,
      prevX: level.start.x,
      prevY: level.start.y,
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
      shield: 0,
      glide: 0,
      power: 0
    },
    pickups: level.pickups.map(([x, y, type]) => ({ x, y, type, taken: false, bob: Math.random() * 9 })),
    enemies: level.enemies.map((e, i) => ({
      ...e,
      w: 42,
      h: 36,
      dir: i % 2 ? -1 : 1,
      alive: true,
      stun: 0,
      shoot: 30 + i * 9
    })),
    moving: level.moving.map((m) => ({ ...m, baseX: m.x, baseY: m.y, lastX: m.x, lastY: m.y, wave0: Math.sin(m.phase * 80 * 0.035 * m.speed) })),
    boosters: level.boosters.map((b) => ({ ...b, cooldown: 0 })),
    rails: level.rails.map((r) => ({ ...r })),
    locks: level.locks.map((l) => ({ ...l, open: false })),
    crumble: level.crumble.map((c) => ({ ...c, active: true, timer: c.timer ?? 90, reset: 0 })),
    feverGates: level.feverGates.map((g) => ({ ...g })),
    currents: level.currents.map((c) => ({ ...c })),
    signs: level.signs.map((s) => ({ ...s, seen: false })),
    checkpoints: level.checkpoints.map((c) => ({ ...c, active: false }))
  };
}

export function updateGame(state, level, input, dt, hud, finish, audio) {
  if (state.over || state.won) return;
  if (state.respawnFreeze > 0) {
    state.respawnFreeze = Math.max(0, state.respawnFreeze - dt);
    state.shake = Math.max(0, state.shake - dt);
    hud();
    return;
  }
  if (state.hitstop > 0) {
    state.hitstop -= dt;
    return;
  }

  const p = state.player;
  const feverBoost = state.feverActive > 0 ? 1.18 : 1;
  state.time -= dt / 60;
  state.pulse += dt;
  state.portalCd = Math.max(0, state.portalCd - dt);
  for (const b of state.boosters) b.cooldown = Math.max(0, b.cooldown - dt);
  state.checkpointGrace = Math.max(0, state.checkpointGrace - dt);
  state.shake = Math.max(0, state.shake - dt);
  state.flash = Math.max(0, state.flash - dt);
  state.comboTime = Math.max(0, state.comboTime - dt);
  state.remix = Math.max(0, state.remix - dt);
  if (state.comboTime <= 0) state.combo = 1;
  state.feverActive = Math.max(0, state.feverActive - dt);
  p.invincible = Math.max(0, p.invincible - dt);
  p.shield = Math.max(0, p.shield - dt);
  p.glide = Math.max(0, p.glide - dt);
  p.power = Math.max(0, p.power - dt);
  p.attack = Math.max(0, p.attack - dt);
  p.attackCd = Math.max(0, p.attackCd - dt);
  p.dashCd = Math.max(0, p.dashCd - dt);
  p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
  p.coyote = p.onGround ? PHYSICS.coyote : Math.max(0, p.coyote - dt);
  p.dashEnergy = Math.min(100, p.dashEnergy + (p.onGround ? 0.78 : 0.42) * dt);

  if (state.time <= 0) hurtPlayer(state, finish);
  if (input.hit("l") && state.fever >= 100) {
    state.fever = 0;
    state.feverActive = 460;
    state.flash = 28;
    state.shake = 12;
    popup(state, "FEVER", p.x - 10, p.y - 14, "#ffd166");
    burst(state, p.x + p.w / 2, p.y + 28, "#ffd166", 42, 4.2);
    audio?.sfx("fever");
  }

  if (input.hit("ArrowUp", "w", " ")) p.jumpBuffer = PHYSICS.jumpBuffer;
  updateMovingPlatforms(state, dt);
  updateCrumble(state, dt);
  updatePlayer(state, level, input, dt, feverBoost, finish, audio);
  updateEnemies(state, input, dt, feverBoost, finish, audio);
  collectPickups(state, audio);
  updateCheckpoints(state, level, audio);
  updateAct(state, level);
  updateParticles(state, dt);

  if (p.y > H + 140) hurtPlayer(state, finish, true, audio);
  if (rects(p, level.goal)) winGame(state, level, finish);
  hud();
}

function updatePlayer(state, level, input, dt, boost, finish, audio) {
  const p = state.player;
  p.prevX = p.x;
  p.prevY = p.y;
  const left = input.down("ArrowLeft", "a");
  const right = input.down("ArrowRight", "d");
  const accel = (p.onGround ? PHYSICS.groundAccel : PHYSICS.airAccel) * boost;
  const max = (p.onGround ? PHYSICS.maxGround : PHYSICS.maxAir) * boost;
  if (left) {
    p.vx -= accel * dt;
    p.facing = -1;
  }
  if (right) {
    p.vx += accel * dt;
    p.facing = 1;
  }
  if (!left && !right) p.vx *= p.onGround ? PHYSICS.groundFriction : PHYSICS.airFriction;
  p.vx = clamp(p.vx, -max, max);

  if (p.jumpBuffer > 0 && p.coyote > 0) {
    p.vy = PHYSICS.jump;
    p.onGround = false;
    p.coyote = 0;
    p.jumpBuffer = 0;
    burst(state, p.x + p.w / 2, p.y + p.h, "#55e6ff", 11, 2);
    audio?.sfx("jump");
  }

  const jumpHeld = input.down("ArrowUp", "w", " ");
  const canGlide = !p.onGround && jumpHeld && p.vy > -1 && p.glide > 0;
  if (!jumpHeld && p.vy < -4.2) p.vy += 0.5 * dt;

  if (input.hit("k", "Shift") && p.dashEnergy >= 32 && p.dashCd <= 0) {
    p.vx = p.facing * 14.2 * boost;
    p.vy *= 0.32;
    p.dashEnergy -= 32;
    p.dashCd = 18;
    p.invincible = Math.max(p.invincible, 12);
    state.shake = 7;
    burst(state, p.x + p.w / 2, p.y + 30, "#ffd166", 20, 3.4);
    audio?.sfx("dash");
  }

  if ((input.hit("j") || input.down("j")) && p.attackCd <= 0) {
    p.attack = p.power > 0 ? 18 : 13;
    p.attackCd = p.power > 0 ? 16 : 23;
    burst(state, p.x + p.w / 2 + p.facing * 30, p.y + 28, "#ff5d8f", 10, 2.2);
    audio?.sfx("attack");
  }

  p.vy += (canGlide ? PHYSICS.glideGravity : PHYSICS.gravity) * dt;
  if (canGlide) {
    p.vy = Math.min(p.vy, 2.6);
    if (Math.floor(state.pulse) % 7 === 0) burst(state, p.x + p.w / 2, p.y + 40, "#b79cff", 1, 1);
  }

  p.x += p.vx * dt;
  collideX(state, level, p, false);
  p.y += p.vy * dt;
  collideY(state, level, p);
  carryOnMovingPlatforms(state, level, p);
  p.x = clamp(p.x, 0, level.width - p.w);
  handleSpecials(state, level, finish, audio);
  state.camera = clamp(p.x - 960 * 0.36, 0, level.width - 960);
}

function solids(level, state, includeMoving = true) {
  const staticSolids = level.platforms
    .concat(state.crumble.filter((c) => c.active))
    .concat(state.locks.filter((l) => !l.open));
  return includeMoving ? staticSolids.concat(state.moving) : staticSolids;
}

function collideX(state, level, p, includeMoving = true) {
  for (const b of solids(level, state, includeMoving)) {
    if (!rects(p, b)) continue;
    if (p.vx > 0) p.x = b.x - p.w;
    if (p.vx < 0) p.x = b.x + b.w;
    p.vx = 0;
  }
}

function collideY(state, level, p) {
  p.onGround = false;
  for (const b of solids(level, state, false)) {
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

function carryOnMovingPlatforms(state, level, p) {
  const skin = 3;
  for (const m of state.moving) {
    const dx = m.x - m.lastX;
    const dy = m.y - m.lastY;
    const wasAbove = p.prevY + p.h <= m.lastY + skin;
    const crossedTop = p.y + p.h >= m.y && p.prevY + p.h <= m.lastY + Math.max(skin, Math.abs(dy) + skin);
    const overlapsXNow = p.x + p.w > m.x + 4 && p.x < m.x + m.w - 4;
    const riding = wasAbove && crossedTop && overlapsXNow && p.vy >= -1;
    if (riding) {
      p.y = m.y - p.h;
      p.vy = Math.min(0, p.vy);
      p.onGround = true;
      p.x += dx;
      resolveMovingCarryX(state, level, p, dx);
      if (dy < 0) resolveLiftCeiling(state, level, p);
      continue;
    }

    if (!rects(p, m)) continue;
    const fromLeft = p.prevX + p.w <= m.lastX + skin;
    const fromRight = p.prevX >= m.lastX + m.w - skin;
    const fromBelow = p.prevY >= m.lastY + m.h - skin;
    if (fromLeft) {
      p.x = m.x - p.w;
      p.vx = Math.min(p.vx, dx);
    } else if (fromRight) {
      p.x = m.x + m.w;
      p.vx = Math.max(p.vx, dx);
    } else if (fromBelow) {
      p.y = m.y + m.h;
      p.vy = Math.max(0, p.vy);
    } else {
      const leftPen = p.x + p.w - m.x;
      const rightPen = m.x + m.w - p.x;
      if (leftPen < rightPen) p.x = m.x - p.w;
      else p.x = m.x + m.w;
      p.vx = dx;
    }
    resolveMovingCarryX(state, level, p, dx);
  }
}

function resolveMovingCarryX(state, level, p, dx) {
  for (const b of solids(level, state, false)) {
    if (!rects(p, b)) continue;
    if (dx > 0) p.x = b.x - p.w;
    else if (dx < 0) p.x = b.x + b.w;
    else {
      const leftPen = p.x + p.w - b.x;
      const rightPen = b.x + b.w - p.x;
      p.x = leftPen < rightPen ? b.x - p.w : b.x + b.w;
    }
    p.vx = 0;
  }
}

function resolveLiftCeiling(state, level, p) {
  for (const b of solids(level, state, false)) {
    if (!rects(p, b)) continue;
    p.y = b.y + b.h;
    p.vy = Math.max(0, p.vy);
  }
}

function updateMovingPlatforms(state, dt) {
  for (const m of state.moving) {
    m.lastX = m.x;
    m.lastY = m.y;
    const remixBoost = state.remix > 0 ? 1.32 : 1;
    const t = Math.sin((state.pulse + m.phase * 80) * 0.035 * m.speed * remixBoost);
    const delta = t - m.wave0;
    if (m.axis === "x") {
      const amp = Math.min(m.baseX - m.min, m.max - m.baseX);
      m.x = clamp(m.baseX + delta * amp, m.min, m.max);
    }
    if (m.axis === "y") {
      const amp = Math.min(m.baseY - m.min, m.max - m.baseY);
      m.y = clamp(m.baseY + delta * amp, m.min, m.max);
    }
  }
}

function updateCrumble(state, dt) {
  const p = state.player;
  for (const c of state.crumble) {
    if (!c.active) {
      c.reset -= dt;
      if (c.reset <= 0) {
        c.active = true;
        c.timer = c.timerMax ?? c.timer ?? 90;
      }
      continue;
    }
    c.timerMax ??= c.timer;
    const standing = p.prevY + p.h <= c.y + 4 && p.y + p.h >= c.y && p.x + p.w > c.x + 6 && p.x < c.x + c.w - 6 && p.vy >= 0;
    if (!standing) continue;
    c.timer -= dt;
    if (Math.floor(state.pulse) % 8 === 0) burst(state, p.x + p.w / 2, c.y + 6, "#ffd166", 2, 1.1);
    if (c.timer <= 0) {
      c.active = false;
      c.reset = c.respawn ?? 260;
      state.shake = 5;
      burst(state, c.x + c.w / 2, c.y + 10, "#ff8d5d", 18, 2.6);
    }
  }
}

function handleSpecials(state, level, finish, audio) {
  const p = state.player;
  for (const rail of state.rails) {
    if (!rects(p, rail)) continue;
    p.vx = rail.speed ?? 11;
    if (rail.lift) p.vy = Math.min(p.vy, rail.lift);
    p.dashEnergy = 100;
    p.glide = Math.max(p.glide, 160);
    if (Math.floor(state.pulse) % 6 === 0) burst(state, p.x + 8, p.y + p.h, "#55e6ff", 2, 1.8);
  }
  for (const booster of state.boosters) {
    if (booster.cooldown > 0 || !rects(p, booster)) continue;
    const power = booster.power ?? 15;
    p.vx = (booster.vx ?? 0) * power;
    p.vy = (booster.vy ?? -1) * power;
    p.dashEnergy = 100;
    p.glide = Math.max(p.glide, 240);
    p.invincible = Math.max(p.invincible, 10);
    booster.cooldown = 46;
    state.shake = 6;
    burst(state, booster.x + booster.w / 2, booster.y + booster.h / 2, "#b79cff", 28, 3.6);
    audio?.sfx("dash");
  }
  for (const lock of state.locks) {
    if (lock.open) continue;
    const near = p.x + p.w > lock.x - 10 && p.x < lock.x + lock.w + 10 && p.y + p.h > lock.y && p.y < lock.y + lock.h;
    if (!near || state.keys <= 0) continue;
    lock.open = true;
    state.keys -= 1;
    state.score += 20 * state.combo;
    state.shake = 9;
    popup(state, "UNLOCK", lock.x - 12, lock.y - 12, "#ffd166");
    burst(state, lock.x + lock.w / 2, lock.y + lock.h / 2, "#ffd166", 36, 3.4);
    audio?.sfx("checkpoint");
  }
  for (const gate of state.feverGates) {
    if (!rects(p, gate) || state.feverActive > 0) continue;
    if (state.fever >= 100) popup(state, "PRESS L", gate.x - 12, gate.y - 18, "#ffd166");
    else if (Math.floor(state.pulse) % 30 === 0) popup(state, "NEED FEVER", gate.x - 20, gate.y - 18, "#ff5d8f");
    if (state.fever < 100 && state.checkpointGrace <= 0) hurtPlayer(state, finish, false, audio);
  }
  for (const current of state.currents) {
    if (!rects(p, current)) continue;
    p.vx += (current.vx ?? 0) * 0.08;
    p.vy += (current.vy ?? 0) * 0.08;
    p.glide = Math.max(p.glide, 60);
    if (Math.floor(state.pulse) % 8 === 0) burst(state, p.x + p.w / 2, p.y + p.h, current.color || "#55e6ff", 1, 1.4);
  }
  for (const sign of state.signs) {
    if (sign.seen || Math.abs(p.x - sign.x) > 34 || Math.abs(p.y - sign.y) > 140) continue;
    sign.seen = true;
    popup(state, sign.text, sign.x - 20, sign.y - 40, sign.color || "#ffd166");
  }
  for (const s of level.springs) {
    if (rects(p, s) && p.vy >= 0) {
      p.y = s.y - p.h;
      p.vy = PHYSICS.spring;
      p.glide = Math.max(p.glide, 180);
      state.shake = 6;
      burst(state, s.x + s.w / 2, s.y, "#8cffc1", 20, 3.2);
      audio?.sfx("spring");
    }
  }
  for (const h of level.hazards) {
    if (state.checkpointGrace <= 0 && rects(p, h)) hurtPlayer(state, finish, h.type === "pit", audio);
  }
  for (const wind of level.winds) {
    if (rects(p, wind)) {
      p.vy += wind.power;
      p.glide = Math.max(p.glide, 90);
      if (Math.floor(state.pulse) % 10 === 0) burst(state, p.x + p.w / 2, p.y + p.h, "#8cffc1", 1, 1.2);
    }
  }
  for (const gate of level.beatGates) {
    if (gateClosed(state, gate) && rects(p, gate) && state.checkpointGrace <= 0) {
      hurtPlayer(state, finish, false, audio);
    }
  }
  for (const portal of level.portals) {
    if (state.portalCd <= 0 && rects(p, portal)) {
      p.x = portal.to.x;
      p.y = portal.to.y;
      p.vy = -8;
      state.portalCd = 70;
      state.flash = 20;
      burst(state, p.x, p.y, "#b79cff", 36, 3.5);
      audio?.sfx("portal");
    }
  }
}

function gateClosed(state, gate) {
  const t = (state.pulse + gate.phase) % gate.period;
  return t < gate.period * 0.56;
}

function updateEnemies(state, input, dt, boost, finish, audio) {
  const p = state.player;
  const reach = p.power > 0 ? 68 : 50;
  const hit = {
    x: p.facing > 0 ? p.x + p.w - 2 : p.x - reach,
    y: p.y + 7,
    w: reach + 2,
    h: 44
  };

  for (const e of state.enemies) {
    if (!e.alive) continue;
    e.stun = Math.max(0, e.stun - dt);
    e.shoot -= dt;
    const speed = enemySpeed(e.type) * (state.feverActive > 0 ? 0.85 : 1);
    if (e.stun <= 0) {
      e.x += e.dir * speed * dt;
      if (e.x < e.min || e.x > e.max) e.dir *= -1;
    }

    if (e.shoot <= 0 && ["drone", "laser", "light"].includes(e.type)) {
      e.shoot = e.type === "laser" ? 52 : 76;
      const dx = p.x - e.x;
      if (Math.abs(dx) < 430) {
        state.enemies.push({ x: e.x + 15, y: e.y + 10, min: e.x - 8, max: e.x + 8, type: "spark", w: 18, h: 18, dir: dx >= 0 ? 1 : -1, alive: true, stun: 0, shoot: 999 });
      }
    }

    if (e.type === "spark") e.x += e.dir * 4.4 * dt;
    if (e.type === "spark" && Math.abs(e.x - e.min) > 520) e.alive = false;

    if (p.attack > 4 && rects(hit, e)) {
      defeatEnemy(state, e, "#ff5d8f", e.type === "spark" ? 1 : 3, audio);
      continue;
    }

    if (!rects(p, e) || p.invincible > 0) continue;
    if (p.vy > 1.2 && p.y + p.h - e.y < 20 && e.type !== "laser") {
      p.vy = -11.2;
      defeatEnemy(state, e, "#55e6ff", 2, audio);
    } else {
      hurtPlayer(state, finish, false, audio);
    }
  }
}

function enemySpeed(type) {
  return { camera: 1.45, fan: 1.75, speaker: 1.25, light: 1.05, drone: 1.55, dancer: 2.0, laser: 1.15, spark: 4.4 }[type] || 1.3;
}

function defeatEnemy(state, e, color, add, audio) {
  e.alive = false;
  addCombo(state);
  const score = add * state.combo;
  state.score += score;
  state.fever = Math.min(100, state.fever + 7 + add);
  state.hitstop = 3;
  state.shake = 7;
  burst(state, e.x + e.w / 2, e.y + e.h / 2, color, 24, 3.4);
  popup(state, `+${score}`, e.x + e.w / 2, e.y - 8, color);
  audio?.sfx("attack");
}

function collectPickups(state, audio) {
  const p = state.player;
  for (const item of state.pickups) {
    item.bob += 0.08;
    if (item.taken) continue;
    const box = { x: item.x, y: item.y, w: 28, h: 28 };
    if (!rects(p, box)) continue;
    item.taken = true;
    addCombo(state);
    let color = "#ffd166";
    if (item.type === "milk") {
      p.shield = 420;
      p.invincible = Math.max(p.invincible, 44);
      color = "#ffb86b";
    } else if (item.type === "vinyl") {
      p.dashEnergy = 100;
      color = "#55e6ff";
    } else if (item.type === "cassette") {
      p.vy = Math.min(p.vy, -12);
      state.fever = Math.min(100, state.fever + 14);
      state.remix = 520;
      state.flash = 16;
      color = "#f8f3ff";
    } else if (item.type === "feather") {
      p.glide = 520;
      color = "#b79cff";
    } else if (item.type === "fever") {
      state.fever = Math.min(100, state.fever + 24);
      color = "#ffd166";
    } else if (item.type === "glove") {
      p.power = 520;
      color = "#ff5d8f";
    } else if (item.type === "key") {
      state.keys += 1;
      state.fever = Math.min(100, state.fever + 10);
      color = "#ffd166";
      popup(state, `KEY x${state.keys}`, item.x - 8, item.y - 32, color);
    }
    const add = PICKUP_SCORE[item.type] || 1;
    const score = add * state.combo;
    state.score += score;
    state.fever = Math.min(100, state.fever + 2);
    burst(state, item.x + 14, item.y + 14, color, 16, 2.7);
    popup(state, `+${score}`, item.x + 6, item.y - 8, color);
    audio?.sfx("pickup");
  }
}

function addCombo(state) {
  state.combo = Math.min(9, state.combo + 1);
  state.comboTime = 150;
}

function updateCheckpoints(state, level, audio) {
  const p = state.player;
  for (const c of state.checkpoints) {
    if (!c.active && p.x > c.x) {
      c.active = true;
      state.checkpoint = { ...c.respawn };
      state.flash = 18;
      state.fever = Math.min(100, state.fever + 12);
      state.safetyBounce = 1;
      popup(state, "SAVE", c.x, c.y - 154, "#55e6ff");
      burst(state, c.x, c.y - 36, "#55e6ff", 26, 3.2);
      audio?.sfx("checkpoint");
    }
  }
}

function updateAct(state, level) {
  const x = state.player.x;
  state.actIndex = level.acts.findIndex((act) => x >= act.start && x < act.end);
  if (state.actIndex < 0) state.actIndex = level.acts.length - 1;
}

function hurtPlayer(state, finish, fell = false, audio) {
  const p = state.player;
  if (p.invincible > 0 || state.over || state.won) return;
  state.combo = 1;
  state.comboTime = 0;
  if (fell && state.safetyBounce > 0) {
    state.safetyBounce = 0;
    Object.assign(p, {
      x: state.checkpoint.x,
      y: state.checkpoint.y,
      vx: p.facing * 4,
      vy: -12,
      invincible: 130,
      dashEnergy: Math.max(76, p.dashEnergy),
      glide: 180
    });
    state.checkpointGrace = 130;
    state.respawnFreeze = 78;
    state.shake = 8;
    popup(state, "SAFE BOUNCE", p.x - 18, p.y - 16, "#8cffc1");
    burst(state, p.x + p.w / 2, p.y + 30, "#8cffc1", 28, 3.5);
    audio?.sfx("spring");
    return;
  }
  if (p.shield > 0 && !fell) {
    p.shield = 0;
    p.invincible = 100;
    p.vx = -p.facing * 6;
    p.vy = -8;
    state.shake = 11;
    burst(state, p.x + p.w / 2, p.y + 24, "#ffd166", 24, 3.2);
    audio?.sfx("hurt");
    return;
  }
  state.lives -= 1;
  state.shake = 14;
  audio?.sfx("hurt");
  if (state.lives <= 0) {
    state.over = true;
    if (finish) finish("巡演暂告一段落", `V3 收集 ${state.score} 个音符。下次保留连击，Fever 会更快成型。`);
    return;
  }
  Object.assign(p, {
    x: state.checkpoint.x,
    y: state.checkpoint.y,
    vx: 0,
    vy: 0,
    invincible: 130,
    dashEnergy: Math.max(70, p.dashEnergy),
    glide: 120
  });
  state.checkpointGrace = 110;
  state.respawnFreeze = 82;
  state.time = Math.max(50, state.time);
  burst(state, p.x + p.w / 2, p.y + 30, "#ff5d8f", 22, 3);
}

function winGame(state, level, finish) {
  if (state.won) return;
  state.won = true;
  const bonus = Math.ceil(Math.max(0, state.time) / 2) + state.combo * 12;
  state.score += bonus;
  const finalClear = level.isFinal;
  finish(finalClear ? "世界巡演全部完成" : "关卡完成", finalClear ? `最终总分 ${state.score}，终局奖励 ${bonus}。` : `${state.score} 分，通关奖励 ${bonus}。下一关会引入更强机制组合。`);
}

export function burst(state, x, y, color, count, speed) {
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = (0.7 + Math.random()) * speed;
    state.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 0.7,
      life: 34 + Math.random() * 20,
      max: 54,
      size: 2 + Math.random() * 3,
      color
    });
  }
}

export function popup(state, text, x, y, color) {
  state.popups.push({ text, x, y, color, life: 58 });
}

function updateParticles(state, dt) {
  for (const q of state.particles) {
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.vy += 0.06 * dt;
    q.life -= dt;
  }
  state.particles = state.particles.filter((q) => q.life > 0);
  for (const p of state.popups) {
    p.y -= 0.44 * dt;
    p.life -= dt;
  }
  state.popups = state.popups.filter((p) => p.life > 0);
}
