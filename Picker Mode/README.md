# Picker Mode prototype

React/Vite prototype for the Canvas course-content picker, including list and calendar views, selection states, folder controls, and React Magma form controls.

## Run locally

```bash
pnpm install
pnpm dev
```

Open <http://127.0.0.1:5173/> unless Vite reports a different port.

## Verify a handoff build

```bash
pnpm build
pnpm preview
```

For GitHub Pages, enable GitHub Actions as the Pages source. The included
`.github/workflows/deploy-pages.yml` builds the project and publishes `dist`.
Do not use “Deploy from a branch” with the raw source directory: GitHub will
serve `src/main.jsx` as a file instead of running Vite and installing React.

## Project map

- `index.html` — static picker markup and page shell.
- `behavior.js` — picker interactions, fallback icons, list/calendar switching, and generated chapter content.
- `src/main.jsx` — React Magma checkbox and date-input layers mounted into the static picker.
- `styles.css` — layout, responsive behavior, states, and calendar/list presentation.

## Notes for developers

- Figma asset URLs are used when available; `behavior.js` supplies local inline SVG fallbacks when an asset fails to load.
- The current prototype intentionally renders inline due/unlock dates as display text. The generic date-input layer remains available for modal/form fields.
- The list/calendar toggle uses `.is-active` on the selected control. Keep active-state styling in the single view-toggle block in `styles.css` so the two modes cannot drift apart.
