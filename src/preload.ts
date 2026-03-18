import { contextBridge, ipcRenderer } from 'electron';
import type { PanelConfig } from './shared/panel-config';

// Expose a safe subset of Electron IPC to the renderer via the context bridge.
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  getPanelsConfig: () => ipcRenderer.invoke('get-panels-config'),
  onPanelsConfigChange: (callback: (panels: PanelConfig[]) => void) => {
    ipcRenderer.on('panels-config-changed', (_event, panels) => {
      callback(panels);
    });
  },
  readPdf: (filePath: string) => ipcRenderer.invoke('read-pdf', filePath),
  readImage: (filePath: string) => ipcRenderer.invoke('read-image', filePath),
  watchFile: (filePath: string) => ipcRenderer.invoke('watch-file', filePath),
  unwatchAllFiles: () => ipcRenderer.invoke('unwatch-all-files'),
  onFileChanged: (callback: (filePath: string) => void) => {
    ipcRenderer.on('file-changed', (_event, filePath) => {
      callback(filePath);
    });
  },
});
