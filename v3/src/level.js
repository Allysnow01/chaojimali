import { STAGE_PACK } from "./stages/index.js?v=3.6";

const groundY = 492;

export const STAGES = STAGE_PACK.map(({ id, title, subtitle, time, width }) => ({ id, title, subtitle, time, width }));

export function createTourLevel(stageIndex = 0) {
  const spec = STAGE_PACK[stageIndex] || STAGE_PACK[0];
  const level = {
    width: spec.width,
    start: { ...(spec.start || { x: 74, y: 404 }) },
    stageIndex,
    totalStages: STAGE_PACK.length,
    isFinal: stageIndex >= STAGE_PACK.length - 1,
    stage: STAGES[stageIndex] || STAGES[0],
    platforms: [],
    moving: [],
    hazards: [],
    winds: [],
    beatGates: [],
    pickups: [],
    enemies: [],
    decorations: [],
    springs: [],
    portals: [],
    checkpoints: [],
    goal: { ...spec.goal },
    acts: normalizeActs(spec)
  };

  addGround(level, spec.ground || []);
  addPlatforms(level, spec.platforms || []);
  addMoving(level, spec.moving || []);
  addObjects(level, "hazards", spec.hazards || []);
  addObjects(level, "winds", spec.winds || []);
  addObjects(level, "beatGates", spec.beatGates || []);
  addObjects(level, "springs", spec.springs || []);
  addObjects(level, "portals", spec.portals || []);
  addPickups(level, spec.pickups || []);
  addArcs(level, spec.arcs || []);
  addEnemies(level, spec.enemies || []);
  addDecorations(level, spec);
  addCheckpointSet(level, spec.checkpoints || []);
  validateLevel(level);
  return level;
}

function normalizeActs(spec) {
  const acts = (spec.acts || []).map((act, index) => ({
    name: act.name || `${spec.title} ${index + 1}`,
    start: Math.max(0, act.start ?? 0),
    end: Math.min(spec.width, act.end ?? spec.width),
    tint: act.tint || "#17264a",
    mission: act.mission || spec.subtitle,
    music: act.music || "pastoral"
  }));
  if (!acts.length) {
    acts.push({ name: spec.title, start: 0, end: spec.width, tint: "#17264a", mission: spec.subtitle, music: "pastoral" });
  }
  acts[0].start = 0;
  acts[acts.length - 1].end = spec.width;
  return acts;
}

function addGround(level, spans) {
  for (const [x, w, skin, y = groundY] of spans) {
    level.platforms.push({ x, y, w, h: 54, skin });
  }
}

function addPlatforms(level, items) {
  for (const [x, y, w, skin, h = 24] of items) {
    level.platforms.push({ x, y, w, h, skin });
  }
}

function addMoving(level, items) {
  for (const item of items) {
    level.moving.push({ h: 22, skin: "moving", ...item });
  }
}

function addObjects(level, key, items) {
  for (const item of items) {
    level[key].push({ ...item });
  }
}

function addPickups(level, items) {
  for (const [x, y, type] of items) {
    level.pickups.push([x, y, type]);
  }
}

function addArcs(level, arcs) {
  for (const [x, y, count, type, spacing = 62, height = 42] of arcs) {
    for (let i = 0; i < count; i += 1) {
      const t = i / Math.max(1, count - 1);
      level.pickups.push([x + i * spacing, y - Math.sin(t * Math.PI) * height, type]);
    }
  }
}

function addEnemies(level, items) {
  for (const [x, y, min, max, type] of items) {
    level.enemies.push({ x, y, min, max, type });
  }
}

function addCheckpointSet(level, checkpoints) {
  for (const x of checkpoints) {
    const respawn = findSafeRespawn(level, x);
    level.checkpoints.push({ x: respawn.x, y: respawn.y + 58, respawn });
  }
}

function addDecorations(level, spec) {
  for (const act of level.acts) {
    const theme = themeForAct(act.name, spec.decorationTheme);
    for (let x = act.start + 150; x < act.end - 80; x += 320) {
      level.decorations.push({ x, y: 430, theme, type: "sign" });
      if (theme === "porcelain") level.decorations.push({ x: x + 126, y: 468, theme, type: "koi" });
      if (theme === "factory") level.decorations.push({ x: x + 120, y: 412, theme, type: "gear" });
      if (theme === "stage") level.decorations.push({ x: x + 110, y: 446, theme, type: "crowd" });
      if (theme === "roof") level.decorations.push({ x: x + 120, y: 390, theme, type: "antenna" });
      if (theme === "cloud") level.decorations.push({ x: x + 108, y: 408, theme, type: "antenna" });
    }
  }
}

function themeForAct(name, fallback) {
  if (name.includes("屋顶") || name.includes("天台") || name.includes("夜曲")) return "roof";
  if (name.includes("瓷") || name.includes("水巷")) return "porcelain";
  if (name.includes("云") || name.includes("晴天")) return "cloud";
  if (name.includes("工厂") || name.includes("双截棍")) return "factory";
  if (name.includes("终演") || name.includes("舞台")) return "stage";
  return fallback || "street";
}

function findSafeRespawn(level, targetX) {
  const candidates = level.platforms
    .filter((p) => p.w >= 120 && p.y < 500)
    .map((p) => {
      const x = Math.max(p.x + 42, Math.min(targetX, p.x + p.w - 76));
      const inside = targetX >= p.x + 42 && targetX <= p.x + p.w - 76;
      const distance = inside ? 0 : Math.min(Math.abs(targetX - p.x), Math.abs(targetX - (p.x + p.w)));
      const verticalPenalty = p.y < 360 ? 80 : 0;
      return { x, y: p.y - 58, platform: p, score: distance + verticalPenalty };
    })
    .sort((a, b) => a.score - b.score);
  if (!candidates.length) throw new Error(`No safe respawn candidate near ${targetX}`);
  return { x: candidates[0].x, y: candidates[0].y };
}

function validateLevel(level) {
  if (!level.goal || level.goal.x <= level.start.x) throw new Error(`${level.stage.title}: invalid goal`);
  if (!level.platforms.length) throw new Error(`${level.stage.title}: no platforms`);
  if (!level.acts.length || level.acts[0].start !== 0 || level.acts[level.acts.length - 1].end !== level.width) {
    throw new Error(`${level.stage.title}: acts must cover the full level`);
  }

  const unsafe = level.checkpoints.filter((c) => {
    const footX = c.respawn.x + 17;
    const footY = c.respawn.y + 58;
    const onPlatform = level.platforms.some((p) => footX >= p.x && footX <= p.x + p.w && Math.abs(footY - p.y) < 1);
    const inHazard = level.hazards.some((h) => footX >= h.x - 20 && footX <= h.x + h.w + 20 && footY >= h.y - 80);
    return !onPlatform || inHazard;
  });
  if (unsafe.length) {
    throw new Error(`${level.stage.title}: unsafe checkpoints ${unsafe.map((c) => Math.round(c.x)).join(", ")}`);
  }
}
