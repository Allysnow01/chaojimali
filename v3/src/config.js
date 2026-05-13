export const W = 960;
export const H = 540;

export const PHYSICS = {
  gravity: 0.72,
  glideGravity: 0.28,
  groundAccel: 0.82,
  airAccel: 0.55,
  groundFriction: 0.8,
  airFriction: 0.94,
  maxGround: 6.5,
  maxAir: 6.0,
  jump: -15.2,
  spring: -20,
  coyote: 8,
  jumpBuffer: 8
};

export const COLORS = {
  ink: "#fff9e9",
  gold: "#ffd166",
  cyan: "#55e6ff",
  rose: "#ff5d8f",
  mint: "#8cffc1",
  violet: "#b79cff",
  dark: "#070812"
};

export const ACTS = [
  { name: "稻香田街", start: 0, end: 2900, tint: "#17264a", mission: "收集音符、建立连击，安全穿过田街。", music: "pastoral" },
  { name: "夜曲屋顶", start: 2900, end: 6100, tint: "#121a38", mission: "用滑翔穿越屋顶间隙，躲开追光。", music: "nocturne" },
  { name: "青花瓷水巷", start: 6100, end: 9300, tint: "#102d3a", mission: "借助弹簧、传送门和水面路线切换。", music: "porcelain" },
  { name: "晴天云轨", start: 9300, end: 12200, tint: "#1e3555", mission: "利用上升气流与云轨平台保持高度。", music: "sunny" },
  { name: "双截棍工厂", start: 12200, end: 15400, tint: "#281b2f", mission: "读节奏门、处理移动平台和密集敌人。", music: "factory" },
  { name: "七里香终演", start: 15400, end: 19400, tint: "#321d27", mission: "攒满 Fever，穿过舞台灯阵完成终演。", music: "finale" }
];
