import path from 'path';

export const isRunningOnMac = process.platform === 'darwin';

export const paths = {
  appRoot: path.resolve(__dirname, '..'),
  distDir: __dirname,
  rendererDir: path.join(__dirname, 'renderer'),
};
