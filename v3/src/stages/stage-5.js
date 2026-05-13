export const stage = {
  id: 5,
  title: "第五关 双截棍终演",
  subtitle: "工厂节奏门与终演灯阵",
  time: 310,
  width: 7800,
  start: { x: 74, y: 404 },
  goal: { x: 7540, y: 248, w: 118, h: 244 },
  acts: [
    { name: "双截棍工厂", start: 0, end: 3600, tint: "#281b2f", mission: "观察节奏门开合，别硬冲。", music: "factory" },
    { name: "七里香终演", start: 3600, end: 7800, tint: "#321d27", mission: "攒满 Fever 后穿过最后灯阵。", music: "finale" }
  ],
  ground: [
    [0, 900, "factory"], [1160, 700, "factory"], [2160, 740, "factory"],
    [3440, 720, "stage"], [4680, 760, "stage"], [5820, 1540, "stage"]
  ],
  platforms: [
    [320, 392, 190, "factory"], [720, 322, 170, "speaker"], [1270, 394, 210, "factory"],
    [1760, 308, 180, "neon"], [2300, 390, 210, "speaker"], [2840, 318, 180, "factory"],
    [3540, 384, 220, "stage"], [4060, 304, 190, "neon"], [4680, 382, 230, "stage"],
    [5260, 314, 190, "speaker"], [5940, 382, 230, "stage"], [6480, 312, 190, "neon"],
    [6980, 388, 220, "stage"]
  ],
  moving: [
    { x: 940, y: 424, w: 150, h: 22, skin: "moving", axis: "x", min: 900, max: 1230, speed: 1.42, phase: 0.2 },
    { x: 3060, y: 420, w: 150, h: 22, skin: "moving", axis: "x", min: 2940, max: 3480, speed: 1.6, phase: 0.55 },
    { x: 5520, y: 424, w: 150, h: 22, skin: "moving", axis: "y", min: 294, max: 432, speed: 1.4, phase: 0.75 }
  ],
  hazards: [
    { x: 900, y: 520, w: 250, h: 18, type: "laser" },
    { x: 1880, y: 520, w: 260, h: 18, type: "laser" },
    { x: 3720, y: 520, w: 420, h: 18, type: "pit" },
    { x: 5080, y: 520, w: 320, h: 18, type: "laser" }
  ],
  springs: [
    { x: 3280, y: 462, w: 36, h: 30 },
    { x: 5680, y: 462, w: 36, h: 30 }
  ],
  pickups: [
    [760, 280, "glove"], [1800, 266, "fever"], [2880, 276, "vinyl"],
    [4100, 262, "cassette"], [5320, 272, "fever"], [6520, 270, "milk"], [7040, 346, "fever"]
  ],
  arcs: [
    [320, 350, 5, "note"], [1270, 352, 6, "note"], [2300, 348, 5, "note"],
    [3540, 342, 6, "note"], [4680, 340, 6, "note"], [5940, 340, 7, "note"], [6980, 346, 5, "note"]
  ],
  enemies: [
    [560, 454, 340, 880, "laser"], [1380, 454, 1180, 1840, "speaker"],
    [2460, 454, 2200, 2920, "camera"], [3620, 454, 3440, 4100, "dancer"],
    [4800, 454, 4680, 5480, "light"], [6100, 454, 5840, 6760, "drone"],
    [7050, 454, 6820, 7360, "laser"]
  ],
  beatGates: [
    { x: 2050, y: 336, w: 34, h: 156, phase: 18, period: 78 },
    { x: 4420, y: 332, w: 34, h: 160, phase: 48, period: 82 },
    { x: 6840, y: 332, w: 34, h: 160, phase: 12, period: 74 }
  ],
  checkpoints: [2480, 4720, 6300],
  decorationTheme: "factory"
};
