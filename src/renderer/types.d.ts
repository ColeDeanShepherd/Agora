// Augments the global Window with the API surface exposed by the preload script.
import type { PanelConfig } from '../shared/panel-config';
import type { PdfData } from '../shared/pdf-data';
import type { ImageData } from '../shared/image-data';

interface ElectronAPI {
  platform: string;
  getPanelsConfig: () => Promise<PanelConfig[]>;
  onPanelsConfigChange: (callback: (panels: PanelConfig[]) => void) => void;
  readPdf: (filePath: string) => Promise<PdfData>;
  readImage: (filePath: string) => Promise<ImageData>;
  watchFile: (filePath: string) => Promise<void>;
  unwatchAllFiles: () => Promise<void>;
  onFileChanged: (callback: (filePath: string) => void) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
