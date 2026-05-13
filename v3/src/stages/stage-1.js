export const stage = {
  id: 1,
  title: "第一关 稻香田街",
  subtitle: "基础巡演路线",
  time: 300,
  width: 5600,
  start: { x: 74, y: 404 },
  goal: { x: 5360, y: 248, w: 118, h: 244 },
  acts: [
    { name: "稻香街口", start: 0, end: 2600, tint: "#17264a", mission: "收集音符、熟悉跳跃和二段棍。", music: "pastoral" },
    { name: "田边小舞台", start: 2600, end: 5600, tint: "#1e2c4e", mission: "用弹簧和短滑翔越过田埂缺口。", music: "pastoral" }
  ],
  ground: [
    [0, 900, "street"], [1030, 780, "vinyl"], [1960, 860, "street"],
    [3040, 760, "street"], [4050, 1280, "stage"]
  ],
  platforms: [
    [320, 398, 180, "neon"], [650, 342, 170, "neon"], [1030, 386, 190, "speaker"],
    [1450, 334, 190, "vinyl"], [2220, 392, 210, "speaker"], [2600, 324, 190, "neon"],
    [3270, 398, 210, "street"], [3690, 340, 170, "neon"], [4260, 382, 220, "stage"],
    [4780, 316, 200, "speaker"]
  ],
  moving: [
    { x: 2870, y: 428, w: 150, h: 22, skin: "moving", axis: "x", min: 2860, max: 3330, speed: 1.1, phase: 0.2 }
  ],
  hazards: [
    { x: 910, y: 526, w: 120, h: 18, type: "pit" },
    { x: 3820, y: 526, w: 210, h: 18, type: "pit" }
  ],
  springs: [
    { x: 2925, y: 462, w: 36, h: 30 }
  ],
  pickups: [
    [780, 300, "vinyl"], [1160, 450, "milk"], [1510, 292, "cassette"],
    [2660, 284, "feather"], [3730, 298, "fever"], [4860, 274, "vinyl"]
  ],
  arcs: [
    [240, 450, 6, "note"], [650, 302, 5, "note"], [1450, 292, 5, "note"],
    [2210, 350, 6, "note"], [3270, 356, 5, "note"], [4260, 340, 7, "note"]
  ],
  enemies: [
    [545, 454, 505, 850, "camera"], [1180, 454, 1060, 1760, "fan"],
    [2300, 454, 2050, 2780, "speaker"], [4350, 454, 4100, 5200, "dancer"]
  ],
  checkpoints: [2470, 4200],
  decorationTheme: "street"
};
