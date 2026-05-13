const gameKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", " ", "a", "d", "w", "j", "k", "l", "r", "Shift"];

export function createInput(touchButtons) {
  const keys = new Set();
  const pressed = new Set();

  function normalize(key) {
    return key.length === 1 ? key.toLowerCase() : key;
  }

  window.addEventListener("keydown", (event) => {
    const key = normalize(event.key);
    if (gameKeys.includes(key)) event.preventDefault();
    if (!keys.has(key)) pressed.add(key);
    keys.add(key);
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(normalize(event.key));
  });

  touchButtons.forEach((button) => {
    const key = button.dataset.key;
    const down = (event) => {
      event.preventDefault();
      if (!keys.has(key)) pressed.add(key);
      keys.add(key);
    };
    const up = (event) => {
      event.preventDefault();
      keys.delete(key);
    };
    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("pointercancel", up);
    button.addEventListener("pointerleave", up);
  });

  return {
    keys,
    pressed,
    clearPressed() {
      pressed.clear();
    },
    down(...items) {
      return items.some((key) => keys.has(key));
    },
    hit(...items) {
      return items.some((key) => pressed.has(key));
    }
  };
}
