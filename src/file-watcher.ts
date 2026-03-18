import fs from 'fs';

/** Debounce delay for coalescing rapid file-system events (ms). */
const DEBOUNCE_MS = 300;

type FileChangeCallback = (filePath: string) => void;

const watchers = new Map<string, fs.FSWatcher>();
const debounceTimers = new Map<string, NodeJS.Timeout>();

/** Global callback invoked when any watched file changes. */
let onChange: FileChangeCallback | null = null;

/** Sets the callback that fires when any watched file changes. */
export function setFileChangeCallback(callback: FileChangeCallback): void {
  onChange = callback;
}

/** Starts watching a file for changes. Duplicate calls for the same path are ignored. */
export function watchFile(filePath: string): void {
  if (watchers.has(filePath)) return;

  try {
    const watcher = fs.watch(filePath, () => {
      // Debounce rapid changes (e.g. editors that write in stages)
      const existing = debounceTimers.get(filePath);
      if (existing) clearTimeout(existing);

      debounceTimers.set(
        filePath,
        setTimeout(() => {
          debounceTimers.delete(filePath);
          onChange?.(filePath);
        }, DEBOUNCE_MS),
      );
    });

    watchers.set(filePath, watcher);
  } catch (err) {
    console.error(`Failed to watch file: ${filePath}`, err);
  }
}

/** Stops watching a single file. */
export function unwatchFile(filePath: string): void {
  watchers.get(filePath)?.close();
  watchers.delete(filePath);

  const timer = debounceTimers.get(filePath);
  if (timer) {
    clearTimeout(timer);
    debounceTimers.delete(filePath);
  }
}

/** Stops watching all files. */
export function unwatchAll(): void {
  for (const filePath of [...watchers.keys()]) {
    unwatchFile(filePath);
  }
}
