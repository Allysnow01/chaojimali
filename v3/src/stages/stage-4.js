export const stage = {
  id: 4,
  title: "第四关 晴天云轨",
  subtitle: "风场滑翔与空中路线",
  time: 265,
  width: 7000,
  start: { x: 74, y: 404 },
  goal: { x: 6740, y: 248, w: 118, h: 244 },
  acts: [
    { name: "晴天云梯", start: 0, end: 3300, tint: "#1e3555", mission: "借助上升气流延长滑翔。", music: "sunny" },
    { name: "云轨转场", start: 3300, end: 7000, tint: "#22435f", mission: "连续接住竖移云台，保持高度。", music: "sunny" }
  ],
  ground: [
    [0, 820, "cloud"], [1160, 620, "cloud"], [2300, 680, "cloud"],
    [3600, 620, "cloud"], [4740, 780, "cloud"], [5980, 760, "stage"]
  ],
  platforms: [
    [260, 390, 190, "cloud"], [630, 320, 170, "neon"], [1130, 370, 200, "cloud"],
    [1620, 290, 180, "cloud"], [2180, 382, 210, "speaker"], [2740, 292, 190, "neon"],
    [3480, 386, 210, "cloud"], [3990, 300, 180, "cloud"], [4520, 374, 220, "speaker"],
    [5120, 296, 180, "neon"], [5740, 378, 220, "cloud"], [6280, 310, 190, "stage"]
  ],
  moving: [
    { x: 870, y: 424, w: 150, h: 22, skin: "moving", axis: "y", min: 304, max: 432, speed: 1.28, phase: 0.1 },
    { x: 3040, y: 422, w: 150, h: 22, skin: "moving", axis: "x", min: 2980, max: 3540, speed: 1.55, phase: 0.45 },
    { x: 5480, y: 424, w: 150, h: 22, skin: "moving", axis: "y", min: 292, max: 432, speed: 1.35, phase: 0.8 }
  ],
  hazards: [
    { x: 840, y: 526, w: 300, h: 18, type: "pit" },
    { x: 2980, y: 526, w: 570, h: 18, type: "pit" },
    { x: 5540, y: 526, w: 420, h: 18, type: "pit" }
  ],
  winds: [
    { x: 880, y: 235, w: 155, h: 280, power: -1.05 },
    { x: 3060, y: 220, w: 170, h: 300, power: -1.2 },
    { x: 5480, y: 225, w: 170, h: 290, power: -1.05 }
  ],
  pickups: [
    [670, 278, "feather"], [1640, 250, "vinyl"], [2780, 250, "fever"],
    [4020, 258, "cassette"], [5140, 254, "feather"], [6320, 268, "milk"]
  ],
  arcs: [
    [260, 348, 5, "note"], [1130, 326, 6, "note"], [2180, 340, 5, "note"],
    [3480, 344, 6, "note"], [4520, 330, 6, "note"], [5740, 336, 7, "note"]
  ],
  enemies: [
    [520, 454, 300, 780, "drone"], [1260, 454, 1160, 1760, "light"],
    [2400, 454, 2300, 2920, "camera"], [3700, 454, 3600, 4200, "drone"],
    [4900, 454, 4740, 5500, "fan"], [6120, 454, 5980, 6700, "light"]
  ],
  beatGates: [
    { x: 4320, y: 344, w: 34, h: 148, phase: 28, period: 86 }
  ],
  checkpoints: [2380, 4760],
  decorationTheme: "cloud"
};
