export const stage = {
  id: 7,
  title: "第七关 龙卷风广场",
  subtitle: "风轨高速与空中冲刺链",
  time: 330,
  width: 9400,
  start: { x: 74, y: 404 },
  goal: { x: 9140, y: 248, w: 118, h: 244 },
  acts: [
    { name: "风口广场", start: 0, end: 3100, tint: "#203b58", mission: "风场会把路线推向高空。", music: "sunny" },
    { name: "龙卷云轨", start: 3100, end: 6500, tint: "#253e65", mission: "冲刺环和风轨连成高速段。", music: "sunny" },
    { name: "高空终点", start: 6500, end: 9400, tint: "#34285d", mission: "连续空中输入，别掉回低线。", music: "sunny" }
  ],
  sections: [
    { name: "风口起飞", start: 0, end: 1900, mechanic: "强风托举", goal: "让玩家接受空中路线是主路径" },
    { name: "环形冲刺链", start: 1900, end: 4400, mechanic: "冲刺环", goal: "用圆环串起连续空中输入" },
    { name: "龙卷风轨", start: 4400, end: 7100, mechanic: "风+轨道", goal: "在高速中控制跳点" },
    { name: "云端收束", start: 7100, end: 9400, mechanic: "高空移动台", goal: "长距离无地面终段" }
  ],
  ground: [
    [0, 760, "cloud"], [1180, 620, "cloud"], [2400, 620, "cloud"],
    [3660, 620, "cloud"], [4920, 680, "cloud"], [6280, 620, "cloud"],
    [7600, 660, "stage"], [8500, 760, "stage"]
  ],
  platforms: [
    [260, 390, 190, "cloud"], [700, 300, 180, "neon"], [1240, 360, 200, "cloud"],
    [1780, 276, 180, "cloud"], [2420, 374, 210, "speaker"], [3000, 286, 180, "neon"],
    [3660, 382, 220, "cloud"], [4300, 292, 180, "cloud"], [4960, 374, 220, "speaker"],
    [5600, 286, 180, "neon"], [6300, 378, 220, "cloud"], [6980, 282, 190, "cloud"],
    [7680, 376, 220, "stage"], [8300, 300, 190, "neon"], [8800, 384, 220, "stage"]
  ],
  moving: [
    { x: 940, y: 424, w: 150, h: 22, skin: "moving", axis: "y", min: 294, max: 432, speed: 1.35, phase: 0.2 },
    { x: 3380, y: 420, w: 150, h: 22, skin: "moving", axis: "x", min: 3240, max: 3840, speed: 1.75, phase: 0.45 },
    { x: 7160, y: 420, w: 150, h: 22, skin: "moving", axis: "y", min: 276, max: 432, speed: 1.5, phase: 0.75 }
  ],
  winds: [
    { x: 850, y: 218, w: 170, h: 300, power: -1.2 },
    { x: 3120, y: 205, w: 180, h: 315, power: -1.25 },
    { x: 5380, y: 215, w: 180, h: 300, power: -1.1 },
    { x: 7360, y: 205, w: 180, h: 315, power: -1.25 }
  ],
  boosters: [
    { x: 1560, y: 258, w: 44, h: 44, vx: 0.9, vy: -0.7, power: 17 },
    { x: 2700, y: 248, w: 44, h: 44, vx: 0.95, vy: -0.62, power: 17 },
    { x: 4080, y: 260, w: 44, h: 44, vx: 0.88, vy: -0.8, power: 17 },
    { x: 5860, y: 246, w: 44, h: 44, vx: 0.96, vy: -0.56, power: 18 },
    { x: 7480, y: 250, w: 44, h: 44, vx: 0.82, vy: -0.76, power: 17 },
    { x: 8660, y: 270, w: 44, h: 44, vx: 0.5, vy: -0.94, power: 15 }
  ],
  rails: [
    { x: 4480, y: 408, w: 820, h: 34, speed: 12.8, lift: -5 },
    { x: 6500, y: 408, w: 780, h: 34, speed: 13.4, lift: -4.8 }
  ],
  hazards: [
    { x: 780, y: 526, w: 390, h: 18, type: "pit" },
    { x: 1820, y: 526, w: 560, h: 18, type: "pit" },
    { x: 5600, y: 526, w: 650, h: 18, type: "pit" },
    { x: 8260, y: 526, w: 230, h: 18, type: "pit" }
  ],
  pickups: [
    [720, 266, "feather"], [1600, 226, "vinyl"], [2740, 226, "fever"], [4120, 236, "cassette"],
    [5900, 224, "fever"], [7520, 228, "feather"], [8680, 250, "milk"]
  ],
  arcs: [
    [260, 348, 6, "note"], [1240, 318, 6, "note"], [2420, 332, 6, "note"],
    [3660, 340, 7, "note"], [4960, 330, 7, "note"], [6300, 336, 7, "note"],
    [7680, 334, 6, "note"], [8800, 342, 5, "note"]
  ],
  enemies: [
    [520, 454, 260, 740, "drone"], [1320, 454, 1180, 1800, "light"],
    [2500, 454, 2400, 3020, "camera"], [3780, 454, 3660, 4300, "drone"],
    [5060, 454, 4920, 5600, "fan"], [6420, 454, 6280, 7040, "light"],
    [7800, 454, 7600, 8260, "drone"], [8840, 454, 8520, 9180, "laser"]
  ],
  signs: [
    { x: 820, y: 430, label: "WIND", text: "风会把你送上高线", color: "#8cffc1" },
    { x: 1540, y: 430, label: "RING", text: "冲刺环连成主路", color: "#b79cff" },
    { x: 4480, y: 430, label: "RAIL", text: "风轨段会加速", color: "#55e6ff" },
    { x: 7360, y: 430, label: "SKY", text: "别掉回低线", color: "#ffd166" },
    { x: 8620, y: 430, label: "FINAL", text: "最后一环抬进终点", color: "#ff5d8f" }
  ],
  checkpoints: [2600, 5360, 7620],
  decorationTheme: "cloud"
};
