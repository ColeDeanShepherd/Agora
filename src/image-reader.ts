import fs from 'fs';
import path from 'path';
import type { ImageData } from './shared/image-data';

/** Maps file extensions to MIME types for supported image formats. */
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

/** Reads a local image file and returns it as a base64 data URL. */
export function readImage(filePath: string): ImageData {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  const data = fs.readFileSync(filePath);
  const base64 = data.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64}`;

  return { path: filePath, dataUrl, mimeType };
}
