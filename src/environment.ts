import path from 'path';

export const isRunningOnMac = process.platform === 'darwin';

export const paths = {
  distDir: __dirname,
  rendererDir: path.join(__dirname, 'renderer'),
};
