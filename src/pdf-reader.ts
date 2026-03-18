import fs from 'fs';
import type { PdfData } from './shared/pdf-data';

// pdf-parse exports a PDFParse class; require to avoid CJS/ESM issues.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PDFParse } = require('pdf-parse');

/** Reads a local PDF file and extracts its text content. */
export async function readPdf(filePath: string): Promise<PdfData> {
  const data = fs.readFileSync(filePath);
  const parser = new PDFParse({ data });
  const result = await parser.getText();

  return {
    path: filePath,
    pageCount: result.total,
    text: result.text,
  };
}
