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
  { name: "稻香街区", start: 0, end: 2900, tint: "#17264a", mission: "熟悉冲刺和连击，吃满街区音符。" },
  { name: "夜曲屋顶", start: 2900, end: 6100, tint: "#121a38", mission: "用滑翔穿越屋顶间隙，躲开追光。" },
  { name: "青花瓷水城", start: 6100, end: 9300, tint: "#102d3a", mission: "借助弹簧和传送门走上层路线。" },
  { name: "双截棍工厂", start: 9300, end: 12700, tint: "#281b2f", mission: "处理移动平台、低空危险和密集敌人。" },
  { name: "终极舞台", start: 12700, end: 16200, tint: "#321d27", mission: "攒满 Fever 冲进最终舞台。" }
];
