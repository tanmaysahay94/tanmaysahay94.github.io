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

React 19 + TypeScript + Vite, prerendered to static HTML by **vite-react-ssg**
(the `build` script). Deployed to GitHub Pages at https://tanmaysahay.com/.

### The four-variant system (Heritage default since 2026-09-27)

Every visitor lands on **Heritage**; `?v=` pins another variant (in-page
switcher + ⌘K change it). There is no random roll any more.

- `src/variants/Heritage.tsx` — DEFAULT and SSG-canonical (crawlers get it).
  "Reliability × Sabyasachi": SRE status page (uptime timeline per role,
  "past incidents" = `RESUME_DATA.highlights`) in an ivory/oxblood/gold frame.
  Designed on the Claude Design canvas https://claude.ai/artifact/Aub8zX7fSSEFCw2Rp4bjfn
- `src/variants/Ledger.tsx` — brutalist calling card (660px, [expand] toggles)
- `src/variants/Paper.tsx` — serif "paper"; `@media print` makes it the printable résumé
- `src/variants/Terminal.tsx` — amber SRE console (tmux bar, shell session)

`src/variants/VariantSite.tsx` owns variant+theme state; `DEFAULT_VARIANT`
lives in `types.ts`.

### Themes (orthogonal axis)

11 themes × 4 layouts. Token classes `.vt-*` in `src/variants/variants.css`
are the single source of color truth (paise-banao token contract): layout
rules consume `var(--token)` only — **a raw hex outside `.vt-*` is a bug**.
Themes: 4 natives (incl. `vt-heritage`) + light/dark/auto/midnight/terminal + the 5 design-swarm
palettes (brockmann/bulldog/hanko/vanderbilt/aftermarket). Theme persists in
`localStorage['ts-theme']`, deep-links via `?t=`.
`src/variants/contrast.test.ts` parses the CSS and CI-fails any text token
under WCAG 4.5:1 — it discovers `.vt-*` blocks automatically, so new themes
are gated for free.

### Data & content

- `RESUME_DATA` (and `ScrambledText`, `linkify`) live in
  `src/InteractiveResume.tsx` — a RETIRED component kept as the data home.
  All four variants render from it; edit data there, all skins update.
- Evidence links per role: `src/variants/links.ts` (real URLs only).
- `public/resume.pdf` — sanitized build (phone stripped) of
  `~/Sandbox/resume/TanmaySahayResume_FrontierLab.tex` via tectonic. NOTE: the repo
  gitignores `*.pdf`; this file is force-added (`git add -f`).
- Email/phone are NEVER plaintext in static HTML — `ScrambledText`
  unscrambles on click; the ⌘K "email" action builds its mailto at click
  time. Keep it that way.

### SEO layer (do not break)

Prerendered `index.html` with full meta/OG/JSON-LD, `robots.txt`,
`sitemap.xml`, `public/CNAME`. JSON-LD `sameAs` = GitHub + LinkedIn (these
are the only public profile links; everything else stays scrambled).

## Gotchas

- **React 19 purity lint is strict**: no `Math.random()` in `useMemo`, no
  `ref.current` in render, no sync `setState` in effect bodies, no assigning
  `window.location.href` in render-created closures (use `location.assign`).
- **GH Pages deploys transiently fail** with "Deployment failed, try again
  later" — not your bug; `gh run rerun <id> --failed` fixes it.
- Known benign console noise: hydration #418 from ScrambledText (server
  scramble ≠ client scramble; self-heals).
- The known-flaky Chrome screenshot pipeline is a capture artifact, not a
  rendering bug — verify via DOM/text extraction when it blanks.
