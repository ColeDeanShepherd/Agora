import { app, BrowserWindow } from 'electron';
import path from 'path';
import { paths } from './environment';
import { initialWindowSize, quitOnWindowClose } from './config';

// #region Helpers

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: initialWindowSize.width,
    height: initialWindowSize.height,
    webPreferences: {
      preload: path.join(paths.distDir, 'preload.js'),
      webviewTag: true,
    },
  });

  mainWindow.loadFile(path.join(paths.rendererDir, 'index.html'));
}

function ensureWindowExists(): void {
  const noWindow = BrowserWindow.getAllWindows().length === 0;
  if (noWindow) {
    createWindow();
  }
}

// #endregion Helpers

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
  if (quitOnWindowClose) {
    app.quit();
  }
});

// #endregion App Lifecycle
