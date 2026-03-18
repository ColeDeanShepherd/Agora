/** Serialisable representation of an extracted PDF document. */
export interface PdfData {
  /** Absolute path to the source file. */
  path: string;
  /** Total number of pages. */
  pageCount: number;
  /** Full extracted text (all pages concatenated). */
  text: string;
}
