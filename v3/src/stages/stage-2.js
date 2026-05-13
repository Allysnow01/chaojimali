export const stage = {
  id: 2,
  title: "第二关 夜曲屋顶",
  subtitle: "天台追光与移动平台",
  time: 285,
  width: 6400,
  start: { x: 74, y: 404 },
  goal: { x: 6160, y: 248, w: 118, h: 244 },
  acts: [
    { name: "夜曲天台", start: 0, end: 3000, tint: "#121a38", mission: "屋顶会踩碎，落脚后立刻继续跑。", music: "nocturne" },
    { name: "广告牌阵列", start: 3000, end: 6400, tint: "#1d1735", mission: "脆弱广告牌、追光和节奏门连在一起。", music: "nocturne" }
  ],
  ground: [
    [0, 780, "roof"], [1000, 720, "roof"], [1960, 620, "roof"],
    [2940, 760, "roof"], [4180, 680, "roof"], [5180, 980, "stage"]
  ],
  platforms: [
    [250, 388, 190, "roof"], [620, 326, 170, "neon"], [1080, 386, 220, "roof"],
    [1550, 312, 170, "neon"], [2110, 388, 190, "speaker"], [2540, 318, 180, "roof"],
    [3180, 404, 220, "roof"], [3580, 336, 180, "neon"], [4020, 384, 210, "speaker"],
    [4580, 304, 170, "roof"], [5250, 390, 220, "stage"], [5720, 326, 190, "neon"]
  ],
  moving: [
    { x: 820, y: 426, w: 150, h: 22, skin: "moving", axis: "x", min: 810, max: 1050, speed: 1.3, phase: 0 },
    { x: 2650, y: 418, w: 150, h: 22, skin: "moving", axis: "x", min: 2580, max: 3030, speed: 1.55, phase: 0.25 },
    { x: 4880, y: 420, w: 145, h: 22, skin: "moving", axis: "y", min: 310, max: 432, speed: 1.18, phase: 0.7 }
  ],
  crumble: [
    { x: 1820, y: 386, w: 170, h: 24, timer: 74, respawn: 260 },
    { x: 3810, y: 348, w: 160, h: 24, timer: 62, respawn: 280 },
    { x: 5050, y: 366, w: 180, h: 24, timer: 70, respawn: 260 },
    { x: 5560, y: 286, w: 150, h: 24, timer: 58, respawn: 290 }
  ],
  hazards: [
    { x: 780, y: 526, w: 210, h: 18, type: "pit" },
    { x: 1740, y: 526, w: 210, h: 18, type: "pit" },
    { x: 3720, y: 522, w: 180, h: 20, type: "laser" }
  ],
  pickups: [
    [690, 284, "glove"], [1610, 270, "feather"], [1900, 344, "fever"], [2600, 276, "cassette"],
    [3630, 294, "vinyl"], [3890, 306, "milk"], [4910, 268, "fever"], [5760, 284, "milk"]
  ],
  arcs: [
    [250, 346, 5, "note"], [1080, 344, 5, "note"], [1820, 344, 4, "note"],
    [2110, 346, 5, "note"], [3180, 362, 6, "note"], [3810, 306, 4, "note"],
    [4580, 264, 6, "note"], [5250, 348, 6, "note"], [5560, 246, 4, "note"]
  ],
  enemies: [
    [520, 454, 430, 760, "light"], [1260, 454, 1040, 1650, "drone"],
    [2220, 454, 2000, 2550, "camera"], [3300, 454, 3000, 3700, "light"],
    [4300, 454, 4180, 4850, "drone"], [5450, 454, 5200, 6100, "fan"]
  ],
  beatGates: [
    { x: 3890, y: 352, w: 34, h: 140, phase: 18, period: 92 }
  ],
  checkpoints: [2250, 4300],
  decorationTheme: "roof"
};
