import type { Rectangle } from './rectangle';

/** Fields common to every panel type. */
interface BasePanelConfig {
  id: string;
  title: string;
  rect: Rectangle;
}

/** A panel that embeds a remote URL in a <webview>. */
export interface WebviewPanelConfig extends BasePanelConfig {
  type: 'webview';
  url: string;
  partition?: string;
}

/** Execution schedule: re-evaluate on a fixed interval. */
export interface IntervalSchedule {
  type: 'interval';
  intervalMs: number;
}

/** Execution schedule: re-evaluate whenever any input panel's value changes. */
export interface InputChangeSchedule {
  type: 'inputChange';
}

/** Discriminated union of supported execution schedules. */
export type ExecutionSchedule = IntervalSchedule | InputChangeSchedule;

/** A panel driven by a JS expression evaluated on a schedule. */
export interface ReactivePanelConfig extends BasePanelConfig {
  type: 'reactive';
  /** JavaScript expression evaluated to produce a value each tick. */
  expression: string;
  /** When and how often the expression is re-evaluated. */
  schedule: ExecutionSchedule;
  /** Maps local input names (available in the expression as `inputs.<name>`) to source panel IDs. */
  inputs?: Record<string, string>;
  /**
   * JavaScript function `(value) => html | { webviewUrl: string }`.
   * Returns an HTML string for inline content, or a webview signal
   * object to render a <webview> at the given URL (only refreshed when the URL changes).
   */
  render: string;
}

/** Discriminated union of all panel types in panels.json. */
export type PanelConfig = WebviewPanelConfig | ReactivePanelConfig;
