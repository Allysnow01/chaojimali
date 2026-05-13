export const stage = {
  id: 3,
  title: "第三关 青花瓷水巷",
  subtitle: "水面路线与传送门",
  time: 275,
  width: 6800,
  start: { x: 74, y: 404 },
  goal: { x: 6540, y: 248, w: 118, h: 244 },
  acts: [
    { name: "瓷巷低桥", start: 0, end: 3000, tint: "#102d3a", mission: "用弹簧越过水渠，拿到高位音符。", music: "porcelain" },
    { name: "回声拱门", start: 3000, end: 6800, tint: "#173b48", mission: "传送门改变路线，落点前先看平台。", music: "porcelain" }
  ],
  ground: [
    [0, 880, "porcelain"], [1150, 690, "porcelain"], [2140, 760, "porcelain"],
    [3340, 720, "porcelain"], [4540, 740, "porcelain"], [5580, 960, "stage"]
  ],
  platforms: [
    [310, 394, 200, "porcelain"], [700, 322, 160, "neon"], [1240, 386, 210, "porcelain"],
    [1710, 306, 180, "porcelain"], [2260, 394, 220, "speaker"], [2760, 318, 180, "neon"],
    [3480, 388, 220, "porcelain"], [3950, 304, 190, "porcelain"], [4660, 382, 220, "speaker"],
    [5160, 318, 180, "neon"], [5750, 384, 230, "stage"], [6220, 316, 190, "porcelain"]
  ],
  moving: [
    { x: 920, y: 424, w: 150, h: 22, skin: "moving", axis: "x", min: 910, max: 1180, speed: 1.25, phase: 0.3 },
    { x: 3060, y: 420, w: 150, h: 22, skin: "moving", axis: "y", min: 300, max: 432, speed: 1.25, phase: 0.75 },
    { x: 5340, y: 424, w: 150, h: 22, skin: "moving", axis: "x", min: 5280, max: 5650, speed: 1.35, phase: 0.1 }
  ],
  hazards: [
    { x: 900, y: 516, w: 230, h: 22, type: "water" },
    { x: 1840, y: 516, w: 280, h: 22, type: "water" },
    { x: 4080, y: 516, w: 420, h: 22, type: "water" }
  ],
  springs: [
    { x: 1880, y: 462, w: 36, h: 30 },
    { x: 4420, y: 462, w: 36, h: 30 }
  ],
  portals: [
    { x: 2580, y: 426, w: 40, h: 66, to: { x: 3430, y: 312 } },
    { x: 4820, y: 426, w: 40, h: 66, to: { x: 5580, y: 318 } }
  ],
  pickups: [
    [720, 280, "vinyl"], [1780, 264, "feather"], [2620, 344, "fever"],
    [4000, 264, "cassette"], [5200, 276, "milk"], [6260, 274, "fever"]
  ],
  arcs: [
    [300, 352, 5, "note"], [1240, 344, 6, "note"], [2260, 352, 5, "note"],
    [3480, 346, 6, "note"], [4660, 340, 6, "note"], [5750, 342, 7, "note"]
  ],
  enemies: [
    [560, 454, 360, 850, "dancer"], [1340, 454, 1180, 1780, "speaker"],
    [2360, 454, 2160, 2860, "drone"], [3560, 454, 3360, 4020, "camera"],
    [4740, 454, 4560, 5240, "speaker"], [5900, 454, 5620, 6450, "light"]
  ],
  checkpoints: [2380, 4660],
  decorationTheme: "porcelain"
};
