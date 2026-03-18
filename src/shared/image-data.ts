/** Serialisable representation of a loaded image. */
export interface ImageData {
  /** Absolute path to the source file. */
  path: string;
  /** Base64-encoded data URL ready for use in <img> src attributes. */
  dataUrl: string;
  /** Detected MIME type (e.g. image/jpeg). */
  mimeType: string;
}
