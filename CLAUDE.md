# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # TypeScript type-check (tsc -b) + Vite production build
npm run lint       # ESLint with TypeScript + React hooks rules
npm run preview    # Preview production build locally
npm run test       # Vitest (single run)
npm run deploy     # Build + deploy to GitHub Pages (gh-pages -d dist -b main)
npx vitest run src/scramble.test.ts  # Run a single test file
```

## Architecture

Single-page React 19 + TypeScript portfolio site built with Vite. Deployed to GitHub Pages at https://tanmaysahay94.github.io/.

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
