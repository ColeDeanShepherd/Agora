import { isRunningOnMac } from './environment';
import type { RectSize } from './shared/rect-size';

export const quitOnWindowClose = !isRunningOnMac;

export const initialWindowSize: RectSize = {
  width: 800,
  height: 600,
};
