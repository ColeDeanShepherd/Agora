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

/** A panel driven by a JS expression evaluated on a schedule. */
export interface ReactivePanelConfig extends BasePanelConfig {
  type: 'reactive';
  /** JavaScript expression evaluated to produce a value each tick. */
  expression: string;
  /** Re-evaluation interval in milliseconds. */
  intervalMs: number;
  /** JavaScript function body `(value) => html` that returns an HTML string. */
  render: string;
}

/** Discriminated union of all panel types in panels.json. */
export type PanelConfig = WebviewPanelConfig | ReactivePanelConfig;
