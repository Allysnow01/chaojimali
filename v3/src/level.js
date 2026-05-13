import { ACTS } from "./config.js";

const groundY = 492;

export function createTourLevel() {
  const level = {
    width: 16200,
    start: { x: 74, y: 404 },
    platforms: [],
    moving: [],
    hazards: [],
    pickups: [],
    enemies: [],
    springs: [],
    portals: [],
    checkpoints: [],
    goal: { x: 16010, y: 248, w: 118, h: 244 },
    acts: ACTS
  };

  addGround(level);
  addActOne(level);
  addActTwo(level);
  addActThree(level);
  addActFour(level);
  addActFive(level);
  addCheckpointSet(level);
  return level;
}

function addGround(level) {
  const spans = [
    [0, 920, "street"], [1010, 740, "vinyl"], [1850, 820, "street"],
    [3040, 660, "roof"], [3860, 850, "roof"], [4920, 760, "roof"],
    [6220, 680, "porcelain"], [7220, 760, "porcelain"], [8460, 760, "porcelain"],
    [9460, 790, "factory"], [10570, 780, "factory"], [11710, 710, "factory"],
    [12840, 760, "stage"], [13850, 780, "stage"], [14930, 1200, "stage"]
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
    [9640, 392, 190, "factory"], [10010, 332, 180, "speaker"], [10460, 402, 210, "factory"],
    [10920, 322, 190, "neon"], [11340, 382, 210, "factory"], [11860, 306, 190, "speaker"],
    [12330, 382, 210, "factory"]
  ]);
  level.moving.push(
    { x: 9850, y: 438, w: 150, h: 22, skin: "moving", axis: "x", min: 9550, max: 10320, speed: 1.7, phase: 0.1 },
    { x: 11580, y: 430, w: 150, h: 22, skin: "moving", axis: "x", min: 11220, max: 12160, speed: 1.45, phase: 0.55 }
  );
  addArc(level, 9630, 350, 5, "note");
  addArc(level, 10910, 280, 6, "note");
  addArc(level, 11860, 264, 5, "note");
  addPickups(level, [[10070, 290, "milk"], [11000, 280, "glove"], [11920, 264, "vinyl"], [12420, 340, "fever"]]);
  addEnemies(level, [
    [9950, 454, 9480, 10400, "speaker"], [10620, 454, 10300, 11200, "laser"],
    [11580, 454, 11280, 12440, "camera"], [12460, 454, 12000, 12670, "dancer"]
  ]);
  level.hazards.push({ x: 10280, y: 520, w: 210, h: 18, type: "laser" }, { x: 11360, y: 520, w: 180, h: 18, type: "laser" });
}

function addActFive(level) {
  addPlatforms(level, [
    [12980, 382, 230, "stage"], [13430, 318, 190, "neon"], [13890, 384, 230, "stage"],
    [14360, 304, 190, "speaker"], [14820, 374, 240, "stage"], [15360, 318, 200, "neon"],
    [15720, 386, 210, "stage"]
  ]);
  level.moving.push({ x: 14610, y: 430, w: 160, h: 22, skin: "moving", axis: "y", min: 302, max: 448, speed: 1.35, phase: 0.7 });
  addArc(level, 12980, 338, 6, "note");
  addArc(level, 14340, 262, 7, "note");
  addArc(level, 15330, 276, 6, "note");
  addPickups(level, [[13490, 276, "feather"], [13970, 342, "cassette"], [14440, 262, "fever"], [15420, 276, "vinyl"], [15810, 344, "milk"]]);
  addEnemies(level, [
    [13300, 454, 12880, 13750, "fan"], [14180, 454, 13880, 14870, "light"],
    [15080, 454, 14660, 15700, "drone"], [15780, 454, 15300, 16000, "laser"]
  ]);
  level.springs.push({ x: 12770, y: 462, w: 36, h: 30 }, { x: 15120, y: 462, w: 36, h: 30 });
}

function addCheckpointSet(level) {
  for (const x of [2850, 6100, 9300, 12700, 14900]) level.checkpoints.push({ x });
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
