import type { PanelConfig, WebviewPanelConfig, ReactivePanelConfig } from '../shared/panel-config';
import { applyWebviewIframeStyles } from './renderer.js';
import { clearReactivePanels, startReactivePanel } from './reactive-panel.js';

// Derive partition from panel ID to isolate storage per panel
function getPanelPartition(panelId: string): string {
  return `persist:${panelId}`;
}

/** Creates the outer section wrapper shared by all panel types. */
function createPanelShell(config: PanelConfig): HTMLElement {
  const section = document.createElement('section');
  section.className = 'panel';
  section.setAttribute('aria-label', config.title);
  section.style.width = `${config.rect.size.width}px`;
  section.style.height = `${config.rect.size.height}px`;
  section.style.left = `${config.rect.position.x}px`;
  section.style.top = `${config.rect.position.y}px`;

  const title = document.createElement('h1');
  title.textContent = config.title;
  section.appendChild(title);

  return section;
}

function createWebviewPanel(config: WebviewPanelConfig): HTMLElement {
  const section = createPanelShell(config);

  const webview = document.createElement('webview');
  webview.className = 'webview-panel';
  webview.setAttribute('src', config.url);
  webview.setAttribute('allowpopups', '');
  // Use derived partition if not explicitly set
  webview.setAttribute('partition', config.partition ?? getPanelPartition(config.id));

  section.appendChild(webview);
  return section;
}

function createReactivePanel(config: ReactivePanelConfig): HTMLElement {
  const section = createPanelShell(config);

  const content = document.createElement('div');
  content.className = 'reactive-content';
  section.appendChild(content);

  // Schedule expression evaluation after the element is in the DOM
  queueMicrotask(() => startReactivePanel(config, content));

  return section;
}

/** Builds the correct DOM element based on the panel's type. */
function createPanelElement(config: PanelConfig): HTMLElement {
  switch (config.type) {
    case 'reactive':
      return createReactivePanel(config);
    case 'webview':
    default:
      return createWebviewPanel(config as WebviewPanelConfig);
  }
}

/** Replaces all panels in the DOM with elements built from the given configs. */
export function renderPanels(panels: PanelConfig[]): void {
  const container = document.getElementById('panels-container');
  if (!container) return;

  // Tear down running reactive panels before clearing the DOM
  clearReactivePanels();

  // Clear existing panels
  container.innerHTML = '';

  // Create new panels from config
  panels.forEach((panelConfig) => {
    const panelElement = createPanelElement(panelConfig);
    container.appendChild(panelElement);
  });

  // Apply webview iframe styles to new panels
  applyWebviewIframeStyles();
}

/** Loads panels from main process config and subscribes to live config changes. */
export async function initializePanels(): Promise<void> {
  const { electronAPI } = window;

  if (!electronAPI) {
    console.error('electronAPI not found on window');
    return;
  }
  
  try {
    const panels = await electronAPI.getPanelsConfig();
    renderPanels(panels);
  } catch (error) {
    console.error('Failed to get panels config:', error);
  }

  // Listen for config changes and re-render
  electronAPI.onPanelsConfigChange((panels: PanelConfig[]) => {
    renderPanels(panels);
  });
}
