import { createAudio } from "./audio.js?v=3.1";
import { createInput } from "./input.js?v=3.1";
import { createTourLevel } from "./level.js?v=3.1";
import { makeState, updateGame } from "./entities.js?v=3.1";
import { draw } from "./renderer.js?v=3.1";
import { clamp } from "./utils.js?v=3.1";

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

const level = createTourLevel();
const input = createInput(document.querySelectorAll(".touch-btn"));
const audio = createAudio();

let state = makeState(level);
let running = false;
let last = 0;

function startGame() {
  audio.start();
  state = makeState(level);
  running = true;
  last = performance.now();
  overlay.classList.add("hidden");
  requestAnimationFrame(loop);
}

function finish(title, body) {
  running = false;
  audio.sfx(state.won ? "win" : "hurt");
  overlay.querySelector(".mark").textContent = state.won ? "CLEAR V3" : "V3 WORLD TOUR";
  overlay.querySelector("h1").textContent = title;
  overlay.querySelector("p").textContent = body;
  startBtn.textContent = "再开一场";
  overlay.classList.remove("hidden");
  syncHud();
}

function loop(now) {
  if (!running) return;
  const dt = Math.min(32, now - last) / 16.67;
  last = now;
  updateGame(state, level, input, dt, syncHud, finish, audio);
  audio.tick(state.feverActive > 0);
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
  actName.textContent = act.name;
  missionText.textContent = act.mission;
}

startBtn.addEventListener("click", startGame);
window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (key === "r") startGame();
});

draw(ctx, state, level);
syncHud();
