import type { ReactivePanelConfig } from '../shared/panel-config';

// ── Per-panel runtime state ──────────────────────────────────────────

interface ReactiveState {
  config: ReactivePanelConfig;
  contentEl: HTMLElement;
  evaluate: (inputs: Record<string, unknown>) => unknown;
  render: (value: unknown) => string;
  timerId?: ReturnType<typeof setInterval>;
  currentValue?: unknown;
}

/** Active states keyed by panel ID; cleared when panels are re-rendered. */
const activeStates = new Map<string, ReactiveState>();

/** Forward dependency map: source panel ID → set of dependent panel IDs. */
const dependents = new Map<string, Set<string>>();

// ── Lifecycle ────────────────────────────────────────────────────────

/** Stops all running reactive panels (called before a full re-render). */
export function clearReactivePanels(): void {
  for (const state of activeStates.values()) {
    if (state.timerId !== undefined) clearInterval(state.timerId);
  }
  activeStates.clear();
  dependents.clear();
}

// ── Evaluation helpers ───────────────────────────────────────────────

/** Collects the latest values from a panel's declared inputs. */
function getInputValues(config: ReactivePanelConfig): Record<string, unknown> {
  const inputs: Record<string, unknown> = {};
  if (config.inputs) {
    for (const [name, panelId] of Object.entries(config.inputs)) {
      inputs[name] = activeStates.get(panelId)?.currentValue;
    }
  }
  return inputs;
}

/** Evaluates a panel, updates the DOM, then cascades to dependents. */
function tickPanel(panelId: string): void {
  const state = activeStates.get(panelId);
  if (!state) return;

  try {
    const inputs = getInputValues(state.config);
    const value = state.evaluate(inputs);
    state.currentValue = value;
    state.contentEl.innerHTML = state.render(value);
  } catch (err) {
    state.contentEl.textContent = `Error: ${(err as Error).message}`;
  }

  // Propagate to any panels that depend on this one
  const deps = dependents.get(panelId);
  if (deps) {
    for (const depId of deps) {
      tickPanel(depId);
    }
  }
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Registers and starts a single reactive panel.
 *
 * • **interval** schedule  → `setInterval` drives re-evaluation.
 * • **inputChange** schedule → the panel is re-evaluated automatically
 *   whenever any of its source panels produce a new value.
 *
 * Panels must be started in dependency order (sources before consumers)
 * so that initial input values are available on the first tick.
 */
export function startReactivePanel(
  config: ReactivePanelConfig,
  contentEl: HTMLElement,
): void {
  // Compile expression (receives `inputs` object) and render function once
  const evaluate = new Function('inputs', `return (${config.expression})`) as
    (inputs: Record<string, unknown>) => unknown;
  const render = new Function('value', `return (${config.render})(value)`) as
    (v: unknown) => string;

  const state: ReactiveState = { config, contentEl, evaluate, render };
  activeStates.set(config.id, state);

  // Register forward dependencies so source panels can notify us
  if (config.inputs) {
    for (const panelId of Object.values(config.inputs)) {
      if (!dependents.has(panelId)) {
        dependents.set(panelId, new Set());
      }
      dependents.get(panelId)!.add(config.id);
    }
  }

  // Schedule based on the configured strategy
  const { schedule } = config;

  if (schedule.type === 'interval') {
    tickPanel(config.id);
    state.timerId = setInterval(() => tickPanel(config.id), schedule.intervalMs);
  } else {
    // inputChange — run an initial tick so the panel isn't blank
    tickPanel(config.id);
  }
}
