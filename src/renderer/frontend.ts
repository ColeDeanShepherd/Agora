import { initializePanels } from './panel.js';
import { initCanvas } from './canvas.js';

// Initialize canvas and panels on DOM ready
window.addEventListener('DOMContentLoaded', async () => {
  const viewport = document.getElementById('canvas-viewport');
  const canvas = document.getElementById('canvas');
  if (viewport && canvas) {
    initCanvas(viewport, canvas);
  }

  try {
    await initializePanels();
  } catch (error) {
    console.error('Failed to initialize panels:', error);
  }
});
