import { ACTS } from "./config.js?v=3.2";

const groundY = 492;

export function createTourLevel() {
  const level = {
    width: 19400,
    start: { x: 74, y: 404 },
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
    goal: { x: 19160, y: 248, w: 118, h: 244 },
    acts: ACTS
  };

  addGround(level);
  addActOne(level);
  addActTwo(level);
  addActThree(level);
  addActFour(level);
  addActFive(level);
  addActSix(level);
  addDecorations(level);
  addCheckpointSet(level);
  validateCheckpoints(level);
  return level;
}

function addGround(level) {
  const spans = [
    [0, 920, "street"], [1010, 740, "vinyl"], [1850, 820, "street"],
    [3040, 660, "roof"], [3860, 850, "roof"], [4920, 760, "roof"],
    [6220, 680, "porcelain"], [7220, 760, "porcelain"], [8460, 760, "porcelain"],
    [9460, 650, "cloud"], [10280, 650, "cloud"], [11120, 780, "cloud"],
    [12240, 790, "factory"], [13340, 780, "factory"], [14460, 710, "factory"],
    [15590, 760, "stage"], [16600, 780, "stage"], [17680, 1680, "stage"]
  ];
  for (const [x, w, skin] of spans) {
    level.platforms.push({ x, y: groundY, w, h: 54, skin });
  }
}

function addActOne(level) {
  addPlatforms(level, [
    [300, 398, 180, "neon"], [610, 344, 170, "neon"], [930, 384, 170, "speaker"],
    [1360, 402, 180, "vinyl"], [1680, 332, 180, "neon"], [2190, 392, 200, "speaker"],
    [2520, 326, 190, "neon"]
  ]);
  addArc(level, 240, 450, 6, "note");
  addArc(level, 620, 303, 5, "note");
  addArc(level, 1370, 360, 5, "note");
  addPickups(level, [[760, 302, "vinyl"], [1090, 450, "milk"], [1712, 290, "cassette"], [2330, 350, "fever"]]);
  addEnemies(level, [
    [545, 454, 505, 850, "camera"], [1160, 454, 1030, 1720, "fan"],
    [2080, 454, 1900, 2600, "speaker"]
  ]);
  level.springs.push({ x: 2740, y: 462, w: 36, h: 30 });
}

function addActTwo(level) {
  addPlatforms(level, [
    [3140, 410, 220, "roof"], [3480, 348, 190, "neon"], [3920, 392, 210, "roof"],
    [4260, 318, 180, "neon"], [4710, 378, 220, "speaker"], [5150, 310, 200, "roof"],
    [5600, 392, 210, "neon"], [5880, 326, 170, "roof"]
  ]);
  level.moving.push(
    { x: 3320, y: 438, w: 150, h: 22, skin: "moving", axis: "x", min: 3190, max: 3650, speed: 1.35, phase: 0 },
    { x: 5350, y: 386, w: 150, h: 22, skin: "moving", axis: "y", min: 300, max: 430, speed: 1.1, phase: 0.6 }
  );
  addArc(level, 3150, 370, 5, "note");
  addArc(level, 4250, 278, 6, "note");
  addArc(level, 5580, 354, 5, "note");
  addPickups(level, [[3530, 306, "glove"], [4385, 276, "vinyl"], [5195, 268, "milk"], [5920, 284, "cassette"]]);
  addEnemies(level, [
    [3670, 454, 3520, 4550, "light"], [4750, 454, 4620, 5600, "drone"],
    [5850, 454, 5480, 6040, "camera"]
  ]);
  level.hazards.push({ x: 2860, y: 526, w: 170, h: 18, type: "pit" }, { x: 6090, y: 526, w: 130, h: 18, type: "pit" });
}

function addActThree(level) {
  addPlatforms(level, [
    [6410, 398, 220, "porcelain"], [6810, 322, 160, "neon"], [7250, 380, 210, "porcelain"],
    [7650, 306, 180, "porcelain"], [8120, 388, 220, "speaker"], [8580, 320, 180, "neon"],
    [8980, 386, 220, "porcelain"]
  ]);
  level.moving.push(
    { x: 6960, y: 432, w: 160, h: 22, skin: "moving", axis: "x", min: 6660, max: 7350, speed: 1.55, phase: 0.25 },
    { x: 8350, y: 424, w: 140, h: 22, skin: "moving", axis: "y", min: 322, max: 452, speed: 1.25, phase: 0.8 }
  );
  level.portals.push({ x: 6730, y: 426, w: 40, h: 66, to: { x: 7480, y: 250 } }, { x: 8750, y: 426, w: 40, h: 66, to: { x: 9120, y: 300 } });
  level.springs.push({ x: 6260, y: 462, w: 36, h: 30 }, { x: 7870, y: 462, w: 36, h: 30 });
  addArc(level, 6420, 354, 6, "note");
  addArc(level, 7640, 266, 6, "note");
  addArc(level, 8580, 278, 5, "note");
  addPickups(level, [[6880, 280, "feather"], [7330, 338, "fever"], [8170, 346, "vinyl"], [9030, 344, "cassette"]]);
  addEnemies(level, [
    [7120, 454, 6900, 7600, "dancer"], [8230, 454, 7980, 8900, "speaker"],
    [9140, 454, 8800, 9240, "drone"]
  ]);
  level.hazards.push({ x: 7000, y: 516, w: 150, h: 22, type: "water" }, { x: 7900, y: 516, w: 180, h: 22, type: "water" });
}

function addActFour(level) {
  addPlatforms(level, [
    [9640, 402, 190, "cloud"], [10010, 342, 180, "neon"], [10460, 412, 210, "cloud"],
    [10920, 322, 190, "cloud"], [11340, 382, 210, "cloud"], [11860, 306, 190, "neon"]
  ]);
  level.moving.push(
    { x: 9850, y: 438, w: 150, h: 22, skin: "moving", axis: "x", min: 9550, max: 10320, speed: 1.7, phase: 0.1 },
    { x: 11580, y: 430, w: 150, h: 22, skin: "moving", axis: "y", min: 298, max: 440, speed: 1.45, phase: 0.55 }
  );
  addArc(level, 9630, 350, 5, "note");
  addArc(level, 10910, 280, 6, "note");
  addArc(level, 11860, 264, 5, "note");
  addPickups(level, [[10070, 290, "milk"], [11000, 280, "feather"], [11920, 264, "vinyl"]]);
  addEnemies(level, [
    [9950, 454, 9480, 10400, "drone"], [10620, 454, 10300, 11200, "light"],
    [11580, 454, 11280, 12120, "camera"]
  ]);
  level.winds.push({ x: 9380, y: 250, w: 160, h: 270, power: -0.95 }, { x: 10740, y: 230, w: 180, h: 290, power: -1.15 }, { x: 11680, y: 230, w: 170, h: 290, power: -0.9 });
}

function addActFive(level) {
  addPlatforms(level, [
    [12420, 392, 190, "factory"], [12790, 332, 180, "speaker"], [13240, 402, 210, "factory"],
    [13700, 322, 190, "neon"], [14120, 382, 210, "factory"], [14640, 306, 190, "speaker"],
    [15110, 382, 210, "factory"]
  ]);
  level.moving.push(
    { x: 12630, y: 438, w: 150, h: 22, skin: "moving", axis: "x", min: 12330, max: 13100, speed: 1.7, phase: 0.1 },
    { x: 14360, y: 430, w: 150, h: 22, skin: "moving", axis: "x", min: 14000, max: 14940, speed: 1.45, phase: 0.55 }
  );
  addArc(level, 12410, 350, 5, "note");
  addArc(level, 13690, 280, 6, "note");
  addArc(level, 14640, 264, 5, "note");
  addPickups(level, [[12850, 290, "milk"], [13780, 280, "glove"], [14700, 264, "vinyl"], [15200, 340, "fever"]]);
  addEnemies(level, [
    [12730, 454, 12260, 13180, "speaker"], [13400, 454, 13080, 13980, "laser"],
    [14360, 454, 14060, 15220, "camera"], [15240, 454, 14780, 15450, "dancer"]
  ]);
  level.hazards.push({ x: 13060, y: 520, w: 210, h: 18, type: "laser" }, { x: 14140, y: 520, w: 180, h: 18, type: "laser" });
  level.beatGates.push({ x: 13330, y: 372, w: 36, h: 120, phase: 0, period: 96 }, { x: 14510, y: 356, w: 36, h: 136, phase: 42, period: 104 });
}

function addActSix(level) {
  addPlatforms(level, [
    [15740, 382, 230, "stage"], [16190, 318, 190, "neon"], [16650, 384, 230, "stage"],
    [17120, 304, 190, "speaker"], [17580, 374, 240, "stage"], [18120, 318, 200, "neon"],
    [18480, 386, 210, "stage"], [18820, 320, 190, "stage"]
  ]);
  level.moving.push({ x: 17370, y: 430, w: 160, h: 22, skin: "moving", axis: "y", min: 302, max: 448, speed: 1.35, phase: 0.7 });
  addArc(level, 15740, 338, 6, "note");
  addArc(level, 17100, 262, 7, "note");
  addArc(level, 18090, 276, 6, "note");
  addPickups(level, [[16250, 276, "feather"], [16730, 342, "cassette"], [17200, 262, "fever"], [18180, 276, "vinyl"], [18570, 344, "milk"], [18910, 276, "fever"]]);
  addEnemies(level, [
    [16060, 454, 15640, 16510, "fan"], [16940, 454, 16640, 17630, "light"],
    [17840, 454, 17420, 18460, "drone"], [18540, 454, 18060, 18860, "laser"]
  ]);
  level.springs.push({ x: 15530, y: 462, w: 36, h: 30 }, { x: 17880, y: 462, w: 36, h: 30 });
  level.beatGates.push({ x: 17020, y: 342, w: 34, h: 150, phase: 18, period: 86 }, { x: 18710, y: 332, w: 34, h: 160, phase: 55, period: 92 });
}

function addCheckpointSet(level) {
  for (const x of [2540, 5600, 8980, 11860, 15110, 18120]) {
    const respawn = findSafeRespawn(level, x);
    level.checkpoints.push({ x: respawn.x, y: respawn.y + 58, respawn });
  }
}

function addDecorations(level) {
  const bands = [
    [0, 2900, "street"],
    [2900, 6100, "roof"],
    [6100, 9300, "porcelain"],
    [9300, 12200, "cloud"],
    [12200, 15400, "factory"],
    [15400, 19400, "stage"]
  ];
  for (const [start, end, theme] of bands) {
    for (let x = start + 160; x < end; x += 340) {
      level.decorations.push({ x, y: 430, theme, type: "sign" });
      if (theme === "porcelain") level.decorations.push({ x: x + 130, y: 468, theme, type: "koi" });
      if (theme === "factory") level.decorations.push({ x: x + 120, y: 412, theme, type: "gear" });
      if (theme === "stage") level.decorations.push({ x: x + 115, y: 446, theme, type: "crowd" });
      if (theme === "roof") level.decorations.push({ x: x + 120, y: 390, theme, type: "antenna" });
    }
  }
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

function validateCheckpoints(level) {
  const unsafe = level.checkpoints.filter((c) => {
    const box = { x: c.respawn.x, y: c.respawn.y + 58, w: 34, h: 2 };
    return !level.platforms.some((p) => box.x + 17 >= p.x && box.x + 17 <= p.x + p.w && Math.abs(box.y - p.y) < 1);
  });
  if (unsafe.length) {
    throw new Error(`Unsafe checkpoints: ${unsafe.map((c) => Math.round(c.x)).join(", ")}`);
  }
}

function addPlatforms(level, items) {
  for (const [x, y, w, skin] of items) level.platforms.push({ x, y, w, h: 24, skin });
}

function addPickups(level, items) {
  for (const [x, y, type] of items) level.pickups.push([x, y, type]);
}

function addEnemies(level, items) {
  for (const [x, y, min, max, type] of items) level.enemies.push({ x, y, min, max, type });
}

function addArc(level, x, y, count, type) {
  for (let i = 0; i < count; i += 1) {
    level.pickups.push([x + i * 62, y - Math.sin((i / Math.max(1, count - 1)) * Math.PI) * 42, type]);
  }
}
