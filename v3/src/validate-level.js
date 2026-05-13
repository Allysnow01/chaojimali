import { createTourLevel, STAGES } from "./level.js";

const summaries = [];

for (let i = 0; i < STAGES.length; i += 1) {
  const level = createTourLevel(i);
  const hazards = level.hazards;

  for (const c of level.checkpoints) {
    const foot = { x: c.respawn.x + 17, y: c.respawn.y + 58 };
    const platform = level.platforms.find((p) => foot.x >= p.x && foot.x <= p.x + p.w && Math.abs(foot.y - p.y) < 1);
    if (!platform) throw new Error(`${level.stage.title}: checkpoint ${c.x} has no landing platform`);
    const danger = hazards.find((h) => foot.x >= h.x - 24 && foot.x <= h.x + h.w + 24 && foot.y >= h.y - 80);
    if (danger) throw new Error(`${level.stage.title}: checkpoint ${c.x} is too close to ${danger.type}`);
  }

  summaries.push({
    stage: level.stage.title,
    width: level.width,
    acts: level.acts.map((act) => act.name),
    counts: {
      platforms: level.platforms.length + level.moving.length,
      pickups: level.pickups.length,
      enemies: level.enemies.length,
      hazards: level.hazards.length,
      winds: level.winds.length,
      beatGates: level.beatGates.length,
      checkpoints: level.checkpoints.length,
      decorations: level.decorations.length
    },
    checkpoints: level.checkpoints.map((c) => c.respawn)
  });
}

console.log(JSON.stringify({ ok: true, stages: summaries }, null, 2));
