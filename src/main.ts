import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { paths } from './environment';
import { initialWindowSize, quitOnWindowClose } from './config';
import { loadPanelsConfig, watchPanelsConfig } from './config-loader';

// #region Helpers

let mainWindow: BrowserWindow | null = null;
let stopWatchingPanels: (() => void) | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: initialWindowSize.width,
    height: initialWindowSize.height,
    webPreferences: {
      preload: path.join(paths.distDir, 'preload.js'),
      webviewTag: true,
    },
  });

  mainWindow.loadFile(path.join(paths.rendererDir, 'index.html'));

  // Start watching panels config and reload when it changes
  stopWatchingPanels = watchPanelsConfig((panels) => {
    if (mainWindow) {
      mainWindow.webContents.send('panels-config-changed', panels);
    }
  });
}

function ensureWindowExists(): void {
  const noWindow = BrowserWindow.getAllWindows().length === 0;
  if (noWindow) {
    createWindow();
  }
}

// #endregion Helpers

// #region IPC Handlers

ipcMain.handle('get-panels-config', () => {
  return loadPanelsConfig();
});

// #endregion IPC Handlers

// #region App Lifecycle

// Open the first window when the app is initialized.
// On macOS, re-create a window when the Dock icon is clicked and none are open.
app.whenReady().then(() => {
  createWindow();
  app.on('activate', ensureWindowExists);
});

// Quit the app when all windows are closed, except on macOS where it's common for applications
// to stay open until the user explicitly quits with Cmd + Q.
app.on('window-all-closed', () => {
  if (stopWatchingPanels) {
    stopWatchingPanels();
  }
  if (quitOnWindowClose) {
    app.quit();
  }
});

// #endregion App Lifecycle
