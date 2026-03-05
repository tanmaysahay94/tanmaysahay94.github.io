# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # TypeScript type-check (tsc -b) + Vite production build
npm run lint       # ESLint with TypeScript + React hooks rules
npm run test       # Vitest (single run)
npm run preview    # Preview production build locally
npx vitest run src/scramble.test.ts  # Run a single test file
```

## Deployment

**Pushing to `main` deploys to production.** GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages automatically on every push to main. There is no separate deploy command.

Do NOT use `gh-pages` or any script that force-pushes build output to `main` — this will wipe out the source code.

## Verification before push

Always run `npm run lint && npm run build && npm test` before pushing. A pre-push git hook enforces this automatically.

## Architecture

Single-page React 19 + TypeScript portfolio site built with Vite. Deployed to GitHub Pages at https://tanmaysahay.com/.

### Key design decisions

- **Monolithic component**: The entire app lives in `src/InteractiveResume.tsx` (~1300 lines). All resume data is co-located as `RESUME_DATA` and `LAYMAN_CONTENT` constants within this file.
- **No routing or state library**: Tab-based navigation via `useState`. All state is local React hooks (`useState`, `useEffect`, `useMemo`).
- **Dual-language toggle**: `techSpeak` state switches between technical and layman-friendly descriptions. Two parallel data objects provide the content.
- **Dark mode default**: Class-based dark mode (`.dark` on `<html>`), defaults to enabled.
- **Styling**: Tailwind CSS 4 via `@tailwindcss/vite` plugin. No CSS-in-JS. Custom `fadeIn` keyframe in `index.css`.
- **Icons**: Lucide React for all iconography.
- **Filtering**: Global search + multi-dimensional kudos filters (team, theme, year). Filtered results are memoized.

### File structure

- `src/InteractiveResume.tsx` — All UI, data, types, and logic
- `src/scramble.ts` — PII scramble/unscramble engine (bubble sort animation to protect contact info from bots)
- `src/App.tsx` — Thin wrapper exporting InteractiveResume
- `src/main.tsx` — React 19 entry point with StrictMode
- `src/index.css` — Global styles and dark mode setup
- `vite.config.ts` — Vite config with React + Tailwind plugins, `base: '/'`
- `.github/workflows/deploy.yml` — GitHub Actions: Node 20, build, deploy to Pages

### TypeScript config

Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. Target ES2022, JSX automatic transform.

### React 19 lint rules

ESLint enforces strict React 19 purity rules. Common pitfalls:
- **No `Math.random()` in `useMemo`** — impure functions during render are errors. Use `useState(() => ...)` lazy initializer instead.
- **No ref access during render** — reading/writing `ref.current` in the component body (outside effects/handlers) is an error.
- **No `setState` in effects** — calling setState synchronously in `useEffect` is an error. Use lazy `useState` initializers or restructure logic into event handlers.
