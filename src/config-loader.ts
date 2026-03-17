import fs from 'fs';
import path from 'path';
import { paths } from './environment';
import type { PanelConfig } from './shared/panel-config';

const configPath = path.join(paths.appRoot, 'panels.json');

/** Reads and parses the panels config file, returning an empty array on failure. */
export function loadPanelsConfig(): PanelConfig[] {
  try {
    const data = fs.readFileSync(configPath, 'utf-8');
    const config: PanelConfig[] = JSON.parse(data);
    return Array.isArray(config) ? config : [];
  } catch {
    console.error(`Failed to load panels config from ${configPath}`);
    return [];
  }
}

/** Watches the config file for changes and invokes the callback with updated panels. */
export function watchPanelsConfig(
  callback: (panels: PanelConfig[]) => void
): () => void {
  let debounceTimer: NodeJS.Timeout | null = null;

  const watcher = fs.watch(configPath, () => {
    // Debounce rapid file changes
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      const panels = loadPanelsConfig();
      callback(panels);
    }, 300);
  });

  return () => {
    watcher.close();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };
}
