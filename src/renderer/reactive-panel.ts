import type { ReactivePanelConfig } from '../shared/panel-config';

/** Tracks a running reactive panel so it can be torn down on re-render. */
interface ReactiveHandle {
  timerId: ReturnType<typeof setInterval>;
}

/** Active handles keyed by panel ID; cleared when panels are re-rendered. */
const activeHandles = new Map<string, ReactiveHandle>();

/** Stops all running reactive panels (called before a full re-render). */
export function clearReactivePanels(): void {
  for (const handle of activeHandles.values()) {
    clearInterval(handle.timerId);
  }
  activeHandles.clear();
}

/**
 * Builds the evaluate → render pipeline for a single reactive panel.
 * The expression is evaluated and the render function is called once
 * immediately, then repeated on the configured interval.
 */
export function startReactivePanel(
  config: ReactivePanelConfig,
  contentEl: HTMLElement,
): void {
  // Compile expression and render function once
  const evaluate = new Function(`return (${config.expression})`) as () => unknown;
  const render = new Function('value', `return (${config.render})(value)`) as (v: unknown) => string;

  const tick = (): void => {
    try {
      const value = evaluate();
      contentEl.innerHTML = render(value);
    } catch (err) {
      contentEl.textContent = `Error: ${(err as Error).message}`;
    }
  };

  // Run immediately, then schedule
  tick();
  const timerId = setInterval(tick, config.intervalMs);

  activeHandles.set(config.id, { timerId });
}
