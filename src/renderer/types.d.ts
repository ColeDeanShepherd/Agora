// Augments the global Window with the API surface exposed by the preload script.
import type { PanelConfig } from '../shared/panel-config';
import type { PdfData } from '../shared/pdf-data';

interface ElectronAPI {
  platform: string;
  getPanelsConfig: () => Promise<PanelConfig[]>;
  onPanelsConfigChange: (callback: (panels: PanelConfig[]) => void) => void;
  readPdf: (filePath: string) => Promise<PdfData>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
