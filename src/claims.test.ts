import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Public-site guard: internal Google identifiers must never ship.
// Bug/incident/ticket IDs (b/123456, omg/57103, irm/i_…) and go/ links.
const INTERNAL_ID = /\b(?:b|omg)\/\d{5,}|\birm\/[A-Za-z0-9_]{5,}|\bgo\/[A-Za-z0-9]/i;

const SRC = join(__dirname);
const SELF = relative(SRC, __filename);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe('public claims guard', () => {
  it('src/ contains no internal Google IDs or go/ links', () => {
    const hits = walk(SRC)
      .filter((p) => /\.(tsx?|css|json|html)$/.test(p) && relative(SRC, p) !== SELF)
      .flatMap((p) =>
        readFileSync(p, 'utf8')
          .split('\n')
          .map((line, i) => ({ line, at: `${relative(SRC, p)}:${i + 1}` }))
          .filter(({ line }) => INTERNAL_ID.test(line))
          .map(({ at, line }) => `${at}: ${line.trim().slice(0, 80)}`),
      );
    expect(hits).toEqual([]);
  });

  it('the pattern catches the known ID shapes', () => {
    for (const s of ['omg/57103', 'OMG/45447', 'b/342078410', 'irm/i_G9B23gUQ13', 'go/log4j-pa']) {
      expect(INTERNAL_ID.test(s)).toBe(true);
    }
    for (const s of ['https://github.com/tanmaysahay94', 'log4j', '2019–2025']) {
      expect(INTERNAL_ID.test(s)).toBe(false);
    }
  });
});
