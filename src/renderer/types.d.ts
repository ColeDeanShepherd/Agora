// Augments the global Window with the API surface exposed by the preload script.
import type { PanelConfig } from '../shared/panel-config';

interface ElectronAPI {
  platform: string;
  getPanelsConfig: () => Promise<PanelConfig[]>;
  onPanelsConfigChange: (callback: (panels: PanelConfig[]) => void) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
