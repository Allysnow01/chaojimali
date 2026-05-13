export const stage = {
  id: 8,
  title: "第八关 兰亭终章",
  subtitle: "传送迷宫与最终 Fever 长廊",
  time: 360,
  width: 10400,
  start: { x: 74, y: 404 },
  goal: { x: 10140, y: 248, w: 118, h: 244 },
  acts: [
    { name: "墨色长廊", start: 0, end: 3400, tint: "#1b263f", mission: "传送门会改变前进顺序。", music: "porcelain" },
    { name: "兰亭迷阵", start: 3400, end: 7100, tint: "#2b2445", mission: "钥匙、节奏门和水流交错。", music: "finale" },
    { name: "最终安可", start: 7100, end: 10400, tint: "#371f30", mission: "攒满 Fever 冲过最终长廊。", music: "finale" }
  ],
  sections: [
    { name: "墨门开场", start: 0, end: 2400, mechanic: "传送门", goal: "用传送改变路线顺序" },
    { name: "水墨钥匙", start: 2400, end: 5000, mechanic: "水流+钥匙", goal: "在移动控制干扰中收集钥匙" },
    { name: "兰亭门阵", start: 5000, end: 7600, mechanic: "节奏门+锁", goal: "最后一次综合考察读门" },
    { name: "Fever 长廊", start: 7600, end: 10400, mechanic: "Fever 门+高速轨道", goal: "以大段终局 set piece 收束整个游戏" }
  ],
  ground: [
    [0, 920, "porcelain"], [1160, 720, "stage"], [2220, 760, "porcelain"],
    [3380, 760, "stage"], [4600, 740, "porcelain"], [5820, 800, "stage"],
    [7160, 820, "stage"], [8460, 760, "factory"], [9440, 780, "stage"]
  ],
  platforms: [
    [300, 392, 210, "porcelain"], [760, 310, 180, "neon"], [1300, 386, 220, "stage"],
    [1840, 300, 180, "porcelain"], [2400, 388, 220, "speaker"], [2960, 316, 190, "neon"],
    [3560, 392, 230, "stage"], [4180, 306, 190, "porcelain"], [4820, 382, 220, "speaker"],
    [5440, 312, 190, "stage"], [6080, 388, 230, "porcelain"], [6740, 302, 190, "neon"],
    [7400, 380, 230, "stage"], [8060, 310, 190, "speaker"], [8700, 386, 230, "factory"],
    [9300, 308, 190, "neon"], [9820, 384, 240, "stage"]
  ],
  moving: [
    { x: 960, y: 424, w: 150, h: 22, skin: "moving", axis: "x", min: 920, max: 1300, speed: 1.45, phase: 0.2 },
    { x: 3180, y: 420, w: 150, h: 22, skin: "moving", axis: "y", min: 292, max: 432, speed: 1.35, phase: 0.65 },
    { x: 6900, y: 420, w: 150, h: 22, skin: "moving", axis: "x", min: 6720, max: 7350, speed: 1.75, phase: 0.25 }
  ],
  portals: [
    { x: 1980, y: 426, w: 40, h: 66, to: { x: 2860, y: 288 } },
    { x: 4380, y: 426, w: 40, h: 66, to: { x: 5280, y: 288 } },
    { x: 7040, y: 426, w: 40, h: 66, to: { x: 7620, y: 292 } }
  ],
  currents: [
    { x: 2460, y: 430, w: 390, h: 84, vx: 2.0, vy: -0.5, color: "#55e6ff" },
    { x: 4640, y: 426, w: 420, h: 88, vx: -1.6, vy: -0.45, color: "#8ccfff" }
  ],
  locks: [
    { x: 5100, y: 372, w: 52, h: 120 },
    { x: 7340, y: 372, w: 52, h: 120 }
  ],
  feverGates: [
    { x: 8220, y: 336, w: 42, h: 156 },
    { x: 8620, y: 326, w: 42, h: 166 },
    { x: 9180, y: 326, w: 42, h: 166 },
    { x: 9720, y: 326, w: 42, h: 166 }
  ],
  rails: [
    { x: 8040, y: 410, w: 860, h: 34, speed: 13.8, lift: -4.8 },
    { x: 9120, y: 410, w: 880, h: 34, speed: 14.2, lift: -5.1 }
  ],
  boosters: [
    { x: 6540, y: 270, w: 44, h: 44, vx: 0.9, vy: -0.7, power: 17 },
    { x: 7900, y: 292, w: 44, h: 44, vx: 0.95, vy: -0.62, power: 18 },
    { x: 10020, y: 292, w: 44, h: 44, vx: 0.45, vy: -0.92, power: 15 }
  ],
  crumble: [
    { x: 2300, y: 350, w: 160, h: 24, timer: 54, respawn: 300 },
    { x: 5660, y: 346, w: 160, h: 24, timer: 52, respawn: 300 },
    { x: 7600, y: 354, w: 160, h: 24, timer: 48, respawn: 320 }
  ],
  hazards: [
    { x: 920, y: 526, w: 230, h: 18, type: "pit" },
    { x: 2460, y: 516, w: 390, h: 22, type: "water" },
    { x: 4640, y: 516, w: 420, h: 22, type: "water" },
    { x: 7860, y: 520, w: 320, h: 18, type: "laser" },
    { x: 9000, y: 520, w: 220, h: 18, type: "laser" }
  ],
  beatGates: [
    { x: 5800, y: 336, w: 34, h: 156, phase: 18, period: 76 },
    { x: 7160, y: 332, w: 34, h: 160, phase: 45, period: 74 },
    { x: 9480, y: 332, w: 34, h: 160, phase: 20, period: 70 }
  ],
  springs: [
    { x: 3340, y: 462, w: 36, h: 30 },
    { x: 6320, y: 462, w: 36, h: 30 }
  ],
  pickups: [
    [820, 268, "feather"], [2020, 360, "fever"], [3020, 278, "key"], [4300, 262, "cassette"],
    [4900, 270, "key"], [6500, 270, "vinyl"], [7500, 310, "fever"], [8420, 270, "fever"],
    [9300, 266, "milk"], [9820, 344, "fever"]
  ],
  arcs: [
    [300, 350, 6, "note"], [1300, 344, 7, "note"], [2400, 346, 6, "note"],
    [3560, 350, 7, "note"], [4820, 340, 7, "note"], [6080, 346, 7, "note"],
    [7400, 338, 7, "note"], [8700, 344, 7, "note"], [9820, 342, 6, "note"]
  ],
  enemies: [
    [560, 454, 320, 900, "dancer"], [1440, 454, 1160, 1860, "drone"],
    [2500, 454, 2220, 3060, "speaker"], [3700, 454, 3400, 4200, "camera"],
    [4960, 454, 4600, 5480, "laser"], [6240, 454, 5820, 6680, "light"],
    [7480, 454, 7180, 8060, "drone"], [8840, 454, 8480, 9300, "laser"],
    [9820, 454, 9460, 10180, "speaker"]
  ],
  signs: [
    { x: 320, y: 430, label: "PORTAL", text: "传送门会改路线顺序", color: "#b79cff" },
    { x: 3000, y: 430, label: "KEY", text: "墨门钥匙在水流后", color: "#ffd166" },
    { x: 5800, y: 430, label: "BEAT", text: "兰亭门阵连续开合", color: "#ff5d8f" },
    { x: 8200, y: 430, label: "FEVER", text: "最终长廊必须释放 Fever", color: "#ffd166" },
    { x: 9700, y: 430, label: "ALL", text: "最后一段不要停", color: "#ff5d8f" }
  ],
  checkpoints: [3060, 5840, 8740],
  decorationTheme: "stage"
};
