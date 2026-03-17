import type { Rectangle } from './rectangle';

/** Shape of a single panel entry in panels.json. */
export interface PanelConfig {
  id: string;
  title: string;
  url: string;
  rect: Rectangle;
  partition?: string;
}
