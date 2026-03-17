import type { Vector2 } from '../shared/vector2';

// #region Constants

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5.0;
const ZOOM_SENSITIVITY = 0.002;

// #endregion Constants

// #region Canvas State

let pan: Vector2 = { x: 0, y: 0 };
let zoom = 1.0;

let isPanning = false;
let lastPointer: Vector2 = { x: 0, y: 0 };

let canvasElement: HTMLElement | null = null;

// #endregion Canvas State

// #region Transform

/** Applies the current pan/zoom transform to the canvas element. */
function applyTransform(): void {
  if (!canvasElement) {
    return;
  }

  canvasElement.style.transform =
    `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
}

// #endregion Transform

// #region Event Handlers

function onPointerDown(event: PointerEvent): void {
  // Middle-click or Ctrl+left-click to pan
  const isMiddleClick = event.button === 1;
  const isCtrlClick = event.button === 0 && event.ctrlKey;

  if (!isMiddleClick && !isCtrlClick) {
    return;
  }

  event.preventDefault();
  isPanning = true;
  lastPointer = { x: event.clientX, y: event.clientY };

  // Capture pointer so drag works outside the viewport
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent): void {
  if (!isPanning) {
    return;
  }

  const dx = event.clientX - lastPointer.x;
  const dy = event.clientY - lastPointer.y;
  lastPointer = { x: event.clientX, y: event.clientY };

  pan.x += dx;
  pan.y += dy;
  applyTransform();
}

function onPointerUp(event: PointerEvent): void {
  if (!isPanning) {
    return;
  }

  isPanning = false;
  (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
}

function onWheel(event: WheelEvent): void {
  event.preventDefault();

  const viewport = canvasElement?.parentElement;
  if (!viewport) {
    return;
  }

  const rect = viewport.getBoundingClientRect();

  // Cursor position relative to the viewport
  const cursorX = event.clientX - rect.left;
  const cursorY = event.clientY - rect.top;

  const previousZoom = zoom;
  const zoomDelta = -event.deltaY * ZOOM_SENSITIVITY;
  zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + zoomDelta * zoom));

  // Adjust pan so zoom centers on cursor position
  const scaleFactor = zoom / previousZoom;
  pan.x = cursorX - scaleFactor * (cursorX - pan.x);
  pan.y = cursorY - scaleFactor * (cursorY - pan.y);

  applyTransform();
}

// #endregion Event Handlers

// #region Public API

/**
 * Initializes the infinite canvas on a viewport element.
 * The viewport clips content; the canvas inside it receives transforms.
 */
export function initCanvas(viewport: HTMLElement, canvas: HTMLElement): void {
  canvasElement = canvas;

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('pointercancel', onPointerUp);
  viewport.addEventListener('wheel', onWheel, { passive: false });

  applyTransform();
}

// #endregion Public API
