# Agent Rules

## Module Boundaries

- Separate platform/environment detection, app config, and shared types into their own modules.
- Keep entrypoints orchestration-only; extract non-trivial logic into named helper functions.

## Constants and Configuration

- Never repeat magic literals; define constants once and import them where needed.
- Centralize path definitions and reuse them throughout the codebase.

## Frontend

- No inline styles in HTML; use external stylesheets.
- Support light/dark mode with CSS variables and `prefers-color-scheme`.

## TypeScript

- Use explicit return types on exported functions.
- Prefer small, focused modules with clear, single-purpose names.

## Comments

- Add short intent comments for non-obvious behavior, especially platform-specific logic.
- Group related sections with region comments when useful.
