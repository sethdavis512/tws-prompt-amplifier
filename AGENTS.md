# Repository Guidelines

This repository hosts Prompt Amplifier, a tray-based Electron app that enhances prompts using the OpenAI API. Keep changes focused on the Electron main process (`main.js`) and the renderer UI (`index.html`), and maintain the lightweight, single-window tray workflow.

## Project Structure & Module Organization

- `main.js`: Electron main process, tray lifecycle, window positioning, and app events.
- `index.html`: Renderer UI, inline CSS, and client-side logic (OpenAI calls, clipboard).
- `package.json`: Dependencies and Electron build configuration.
- `dist/`: Build output from packaging (generated).

## Build, Test, and Development Commands

- `npm install`: Install dependencies (Node.js 18+ required).
- `npm start`: Launch the Electron app locally.
- `npm run build`: Package installers via `electron-builder` into `dist/`.

## Coding Style & Naming Conventions

- JavaScript uses CommonJS (`require`), 2-space indentation, and semicolons.
- Prefer `camelCase` for functions/variables; use descriptive event handler names (e.g., `toggleWindow`).
- Keep UI styles and renderer logic in `index.html` unless you deliberately split files.
- No formatter/linter is configured—match existing style and whitespace.

## Testing Guidelines

- No automated tests are present. Do a manual smoke test: tray indicator (⚡ title) shows, window opens/closes, prompt amplifies, copy button works, and shortcuts (`Ctrl/Cmd + Enter`, `Escape`) behave.
- If adding tests, place them under `tests/` or `__tests__/` and add an `npm` script.

## Commit & Pull Request Guidelines

- Git history uses Conventional Commit prefixes (e.g., `feat: initialize project...`). Continue with `feat:`, `fix:`, `docs:`, `chore:`, etc.
- PRs should include a short summary, test steps, and screenshots/GIFs for UI changes.

## Security & Configuration Tips

- The OpenAI API key is stored in renderer `localStorage`; never hardcode or commit keys.
- If altering key handling or API usage, update `README.md` with any new setup steps.
