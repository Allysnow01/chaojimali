import { createAudio } from "./audio.js?v=3.12";
import { createInput } from "./input.js?v=3.12";
import { createTourLevel, STAGES } from "./level.js?v=3.12";
import { makeState, updateGame } from "./entities.js?v=3.12";
import { draw } from "./renderer.js?v=3.12";
import { createRouteMap } from "./route-map.js?v=3.12";
import { clamp } from "./utils.js?v=3.12";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const comboEl = document.getElementById("combo");
const timerEl = document.getElementById("timer");
const dashMeter = document.getElementById("dashMeter");
const feverMeter = document.getElementById("feverMeter");
const progressMeter = document.getElementById("progressMeter");
const actName = document.getElementById("actName");
const missionText = document.getElementById("missionText");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const deathOverlay = document.getElementById("deathOverlay");
const deathText = document.getElementById("deathText");

const input = createInput(document.querySelectorAll(".touch-btn"));
const audio = createAudio();
const progressKey = "nunchaku-v3-route-progress";
let savedProgress = loadProgress();
const routeMap = createRouteMap({
  root: document.getElementById("routeMap"),
  list: document.getElementById("routeStages"),
  runner: document.getElementById("routeRunner"),
  title: document.getElementById("routeTitle"),
  hint: document.getElementById("routeHint"),
  action: document.getElementById("routeStartBtn"),
  resetAction: document.getElementById("routeResetBtn"),
  stages: STAGES,
  onEnter: beginStage,
  onReset: resetProgress,
  completedStage: savedProgress.completed
});

let stageIndex = 0;
let level = createTourLevel(stageIndex);
let state = makeState(level);
let running = false;
let last = 0;

function beginStage(index) {
  audio.start();
  stageIndex = index;
  level = createTourLevel(stageIndex);
  state = makeState(level);
  running = true;
  last = performance.now();
  overlay.classList.add("hidden");
  routeMap.hide();
  deathOverlay.classList.add("hidden");
  requestAnimationFrame(loop);
}

function startGame() {
  if (savedProgress.completed >= STAGES.length - 1) resetProgress();
  stageIndex = Math.min(savedProgress.completed + 1, STAGES.length - 1);
  level = createTourLevel(stageIndex);
  state = makeState(level);
  running = false;
  overlay.classList.add("hidden");
  deathOverlay.classList.add("hidden");
  draw(ctx, state, level);
  syncHud();
  routeMap.show(stageIndex, savedProgress.completed);
}

function finish(title, body) {
  running = false;
  audio.sfx(state.won ? "win" : "hurt");
  const finalClear = state.won && stageIndex >= STAGES.length - 1;
  if (state.won && !finalClear) {
    const cleared = stageIndex;
    saveProgress(cleared);
    stageIndex += 1;
    level = createTourLevel(stageIndex);
    state = makeState(level);
    draw(ctx, state, level);
    syncHud();
    deathOverlay.classList.add("hidden");
    window.setTimeout(() => routeMap.show(stageIndex, cleared), 850);
    return;
  }
  if (state.won && finalClear) saveProgress(stageIndex);
  overlay.querySelector(".mark").textContent = state.won ? (finalClear ? "ALL CLEAR V3" : "STAGE CLEAR") : "V3 WORLD TOUR";
  overlay.querySelector("h1").textContent = title;
  overlay.querySelector("p").textContent = body;
  startBtn.textContent = state.won && !finalClear ? "下一关" : "再开一场";
  overlay.classList.remove("hidden");
  routeMap.hide();
  deathOverlay.classList.add("hidden");
  syncHud();
}

function loop(now) {
  if (!running) return;
  const dt = Math.min(32, now - last) / 16.67;
  last = now;
  updateGame(state, level, input, dt, syncHud, finish, audio);
  syncDeathOverlay();
  audio.tick(state.actIndex, state.feverActive > 0, state.remix > 0);
  draw(ctx, state, level);
  input.clearPressed();
  requestAnimationFrame(loop);
}

function syncHud() {
  const act = level.acts[state.actIndex] || level.acts[0];
  scoreEl.textContent = state.score;
  livesEl.textContent = state.lives;
  comboEl.textContent = `x${state.combo}`;
  timerEl.textContent = Math.max(0, Math.ceil(state.time));
  dashMeter.style.width = `${state.player.dashEnergy}%`;
  feverMeter.style.width = `${state.fever}%`;
  progressMeter.style.width = `${clamp((state.player.x / (level.goal.x - 60)) * 100, 0, 100)}%`;
  actName.textContent = `${level.stage.title} · ${act.name}`;
  missionText.textContent = `${level.stage.subtitle} · ${act.mission}`;
}

function syncDeathOverlay() {
  if (state.respawnFreeze > 0) {
    deathOverlay.classList.remove("hidden");
    deathText.textContent = `回到安全点 · ${Math.ceil(state.respawnFreeze / 60)}`;
  } else {
    deathOverlay.classList.add("hidden");
  }
}

startBtn.addEventListener("click", () => {
  startGame();
});
window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (key === "r") startGame();
});

draw(ctx, state, level);
syncHud();
routeMap.show(Math.min(savedProgress.completed + 1, STAGES.length - 1), savedProgress.completed);

function loadProgress() {
  try {
    const raw = window.localStorage.getItem(progressKey);
    const parsed = raw ? JSON.parse(raw) : {};
    return { completed: clamp(Number(parsed.completed ?? -1), -1, STAGES.length - 1) };
  } catch {
    return { completed: -1 };
  }
}

function saveProgress(completed) {
  savedProgress = { completed: Math.max(savedProgress.completed, completed) };
  window.localStorage.setItem(progressKey, JSON.stringify(savedProgress));
}

function resetProgress() {
  savedProgress = { completed: -1 };
  window.localStorage.removeItem(progressKey);
}
