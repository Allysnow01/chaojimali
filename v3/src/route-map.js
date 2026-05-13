export function createRouteMap({ root, list, runner, title, hint, action, resetAction, stages, onEnter, onReset, completedStage = -1 }) {
  let current = 0;
  let completed = completedStage;
  let entering = false;

  function show(nextStage, clearedStage = completed) {
    current = Math.min(Math.max(0, nextStage), stages.length - 1);
    completed = Math.max(completed, clearedStage);
    entering = false;
    root.classList.remove("hidden", "entering");
    render();
    requestAnimationFrame(() => placeRunner(Math.max(0, current - 1)));
  }

  function hide() {
    root.classList.add("hidden");
    root.classList.remove("entering");
  }

  function render() {
    const next = stages[current];
    title.textContent = "巡演路线图";
    hint.textContent = next ? `下一站：${next.title}。已完成 ${Math.max(0, completed + 1)} / ${stages.length} 关。` : "世界巡演已经完成。";
    action.textContent = next ? `进入 ${next.title}` : "重新巡演";
    action.disabled = false;
    resetAction.hidden = completed < 0;
    list.innerHTML = stages.map((stage, index) => {
      const status = index <= completed ? "cleared" : index === current ? "current" : "locked";
      const badge = status === "cleared" ? "CLEAR" : status === "current" ? "NEXT" : `${index + 1}`;
      return `
        <li class="route-node ${status}" data-stage="${index}" tabindex="${index <= completed + 1 ? 0 : -1}" role="button" aria-label="${stage.title}">
          <i class="route-gate"></i>
          <span>${badge}</span>
          <strong>${stage.title}</strong>
          <small>${stage.subtitle}</small>
        </li>
      `;
    }).join("");
  }

  function enter() {
    if (entering) return;
    entering = true;
    action.disabled = true;
    root.classList.add("entering");
    placeRunner(Math.max(0, current - 1));
    requestAnimationFrame(() => {
      runner.classList.add("walking");
      placeRunner(current);
    });
    window.setTimeout(() => {
      runner.classList.remove("walking");
      hide();
      onEnter(current);
    }, 1320);
  }

  function choose(stageIndex) {
    if (stageIndex > completed + 1 || entering) return;
    current = stageIndex;
    render();
    requestAnimationFrame(() => placeRunner(current));
  }

  function reset() {
    completed = -1;
    current = 0;
    onReset();
    render();
    requestAnimationFrame(() => placeRunner(0));
  }

  function placeRunner(stageIndex) {
    const routeBox = root.getBoundingClientRect();
    const gate = list.querySelector(`[data-stage="${stageIndex}"] .route-gate`);
    if (!gate) return;
    const box = gate.getBoundingClientRect();
    const x = box.left - routeBox.left + box.width / 2 - 17;
    const y = box.top - routeBox.top + box.height / 2 - 45;
    runner.style.transform = `translate(${x}px, ${y}px)`;
  }

  action.addEventListener("click", enter);
  resetAction.addEventListener("click", reset);
  list.addEventListener("click", (event) => {
    const node = event.target.closest(".route-node");
    if (node) choose(Number(node.dataset.stage));
  });
  list.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const node = event.target.closest(".route-node");
    if (!node) return;
    event.preventDefault();
    choose(Number(node.dataset.stage));
  });

  return { show, hide, enter, choose };
}
