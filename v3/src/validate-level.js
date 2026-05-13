import { createTourLevel } from "./level.js";

const level = createTourLevel();
const hazards = level.hazards;

for (const c of level.checkpoints) {
  const foot = { x: c.respawn.x + 17, y: c.respawn.y + 58 };
  const platform = level.platforms.find((p) => foot.x >= p.x && foot.x <= p.x + p.w && Math.abs(foot.y - p.y) < 1);
  if (!platform) throw new Error(`Checkpoint ${c.x} has no landing platform`);
  const danger = hazards.find((h) => foot.x >= h.x - 24 && foot.x <= h.x + h.w + 24 && foot.y >= h.y - 80);
  if (danger) throw new Error(`Checkpoint ${c.x} is too close to ${danger.type}`);
}

const counts = {
  platforms: level.platforms.length + level.moving.length,
  pickups: level.pickups.length,
  enemies: level.enemies.length,
  hazards: level.hazards.length,
  checkpoints: level.checkpoints.length,
  decorations: level.decorations.length
};

console.log(JSON.stringify({ ok: true, counts, checkpoints: level.checkpoints.map((c) => c.respawn) }, null, 2));
