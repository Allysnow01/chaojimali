export const stage = {
  id: 6,
  title: "第六关 本草药铺",
  subtitle: "药铺巷战与双路线钥匙",
  time: 335,
  width: 9000,
  start: { x: 74, y: 404 },
  goal: { x: 8740, y: 248, w: 118, h: 244 },
  acts: [
    { name: "药柜街口", start: 0, end: 2800, tint: "#173328", mission: "药柜平台会形成上下两条路线。", music: "factory" },
    { name: "草药吊桥", start: 2800, end: 6100, tint: "#263421", mission: "拿钥匙、打穿敌人阵，进入吊桥高线。", music: "factory" },
    { name: "药炉终段", start: 6100, end: 9000, tint: "#35231c", mission: "节奏门和脆弱平台压缩落脚时间。", music: "factory" }
  ],
  sections: [
    { name: "药柜上行", start: 0, end: 1800, mechanic: "上下双路线", goal: "给玩家选择安全低线或奖励高线" },
    { name: "药铺巷战", start: 1800, end: 3600, mechanic: "密集敌阵", goal: "让双截棍成为推进手段" },
    { name: "钥匙吊桥", start: 3600, end: 6100, mechanic: "钥匙门+移动桥", goal: "把探索目标放在中段" },
    { name: "药炉冲刺", start: 6100, end: 9000, mechanic: "节奏门+塌板", goal: "以更高密度完成收束" }
  ],
  ground: [
    [0, 900, "street"], [1120, 680, "factory"], [2060, 820, "factory"],
    [3180, 760, "stage"], [4340, 740, "factory"], [5480, 820, "factory"],
    [6760, 760, "stage"], [7900, 900, "stage"]
  ],
  platforms: [
    [280, 384, 210, "factory"], [650, 318, 190, "neon"], [1180, 388, 220, "factory"],
    [1660, 304, 180, "speaker"], [2240, 386, 220, "factory"], [2740, 316, 190, "neon"],
    [3350, 392, 230, "stage"], [3920, 304, 180, "factory"], [4520, 382, 220, "speaker"],
    [5080, 312, 190, "factory"], [5680, 388, 220, "neon"], [6320, 318, 190, "factory"],
    [7020, 382, 230, "stage"], [7600, 306, 190, "speaker"], [8240, 388, 230, "stage"]
  ],
  moving: [
    { x: 920, y: 424, w: 150, h: 22, skin: "moving", axis: "x", min: 900, max: 1180, speed: 1.35, phase: 0.1 },
    { x: 3720, y: 424, w: 150, h: 22, skin: "moving", axis: "y", min: 300, max: 432, speed: 1.25, phase: 0.6 },
    { x: 6100, y: 420, w: 150, h: 22, skin: "moving", axis: "x", min: 5960, max: 6460, speed: 1.6, phase: 0.3 }
  ],
  crumble: [
    { x: 3000, y: 362, w: 160, h: 24, timer: 58, respawn: 280 },
    { x: 6600, y: 342, w: 160, h: 24, timer: 54, respawn: 280 },
    { x: 7860, y: 350, w: 160, h: 24, timer: 48, respawn: 300 }
  ],
  locks: [
    { x: 4180, y: 372, w: 52, h: 120 },
    { x: 6480, y: 372, w: 52, h: 120 }
  ],
  hazards: [
    { x: 900, y: 520, w: 210, h: 18, type: "laser" },
    { x: 2860, y: 520, w: 300, h: 18, type: "pit" },
    { x: 6500, y: 520, w: 250, h: 18, type: "laser" },
    { x: 7680, y: 520, w: 210, h: 18, type: "pit" }
  ],
  beatGates: [
    { x: 5820, y: 342, w: 34, h: 150, phase: 15, period: 82 },
    { x: 7280, y: 332, w: 34, h: 160, phase: 50, period: 78 }
  ],
  springs: [
    { x: 1860, y: 462, w: 36, h: 30 },
    { x: 5320, y: 462, w: 36, h: 30 }
  ],
  pickups: [
    [690, 278, "glove"], [1700, 264, "fever"], [2960, 320, "key"], [3960, 262, "milk"],
    [5200, 270, "key"], [6350, 276, "cassette"], [7360, 290, "fever"], [8300, 344, "vinyl"]
  ],
  arcs: [
    [280, 344, 6, "note"], [1180, 344, 6, "note"], [2240, 344, 6, "note"],
    [3350, 350, 7, "note"], [4520, 340, 6, "note"], [5680, 344, 6, "note"],
    [7020, 340, 7, "note"], [8240, 346, 5, "note"]
  ],
  enemies: [
    [520, 454, 300, 880, "fan"], [1360, 454, 1120, 1760, "speaker"],
    [2360, 454, 2080, 2860, "dancer"], [3500, 454, 3180, 4140, "laser"],
    [4620, 454, 4360, 5200, "camera"], [5820, 454, 5480, 6320, "drone"],
    [7060, 454, 6780, 7600, "light"], [8360, 454, 7920, 8780, "laser"]
  ],
  signs: [
    { x: 250, y: 430, label: "HIGH", text: "高线奖励更多音符", color: "#8cffc1" },
    { x: 1840, y: 430, label: "FIGHT", text: "双截棍推进敌阵", color: "#ff5d8f" },
    { x: 2960, y: 430, label: "KEY", text: "拿药铺钥匙开门", color: "#ffd166" },
    { x: 5820, y: 430, label: "BEAT", text: "药炉门跟节奏开合", color: "#ff5d8f" },
    { x: 7840, y: 430, label: "RUN", text: "塌板段别停", color: "#ffd166" }
  ],
  checkpoints: [2700, 5200, 7340],
  decorationTheme: "factory"
};
