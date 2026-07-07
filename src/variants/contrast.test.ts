// WCAG contrast gate (ported from paise-banao's theme governance).
// Parses variants.css — the single source of color truth — and fails the
// build if any text token drops below its floor. Lesson origin: the
// paise-banao 2026-06-13 light-theme regression (a token picked "by feel"
// at 3.0:1). Never eyeball contrast; compute it.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// vitest runs from the project root; import.meta.url is not file:// under vite-node.
const css = readFileSync('src/variants/variants.css', 'utf8');

function tokensOf(themeClass: string): Record<string, string> {
  const block = css.match(new RegExp(`\\.${themeClass}\\s*\\{([^}]+)\\}`))?.[1] ?? '';
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) out[m[1]] = m[2];
  return out;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg: string, bg: string): number {
  const [a, b] = [luminance(fg), luminance(bg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// token → [minimum ratio vs --bg]. 4.5 = WCAG AA body text.
const FLOORS: Record<string, number> = {
  text: 4.5,
  muted: 4.5,
  faint: 4.5, // used for real (sometimes interactive) text in all variants
  heading: 4.5,
  link: 4.5,
};

describe.each(['vt-ledger', 'vt-paper', 'vt-term'])('%s tokens', (theme) => {
  const tokens = tokensOf(theme);

  it('defines a background', () => {
    expect(tokens.bg).toBeTruthy();
  });

  for (const [name, floor] of Object.entries(FLOORS)) {
    it(`--${name} clears ${floor}:1 on --bg`, () => {
      if (!tokens[name]) return; // token not used by this variant
      const r = ratio(tokens[name], tokens.bg);
      expect(r, `--${name} ${tokens[name]} on --bg ${tokens.bg} = ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(floor);
    });
  }
});
