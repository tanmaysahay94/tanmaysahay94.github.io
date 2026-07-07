import { useEffect, useState } from 'react';
import './variants.css';
import Ledger from './Ledger';
import Paper from './Paper';
import Terminal from './Terminal';
import CmdK from './CmdK';
import { VARIANTS, NATIVE_VT, isVariant, isTheme, type Variant, type Theme } from './types';


// SSG prerenders 'paper' (richest text for crawlers); the client re-rolls
// after hydration so every visit lands on a random variant. `?v=` pins a
// variant; theme (`?t=` / localStorage 'ts-theme') persists across visits.
export default function VariantSite() {
  const [variant, setVariant] = useState<Variant>('paper');
  const [theme, setTheme] = useState<Theme>('native');

  useEffect(() => {
    // queueMicrotask, not requestAnimationFrame: rAF is paused in unfocused
    // tabs, which would leave background-opened visits stuck on the SSG default.
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      setVariant(isVariant(v) ? v : VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);
      const t = params.get('t') ?? window.localStorage.getItem('ts-theme');
      if (isTheme(t)) setTheme(t);
    });
    return () => {
      alive = false;
    };
  }, []);

  const switchTo = (v: Variant) => {
    setVariant(v);
    const url = new URL(window.location.href);
    url.searchParams.set('v', v);
    window.history.replaceState(null, '', url);
  };

  const themeTo = (t: Theme) => {
    setTheme(t);
    window.localStorage.setItem('ts-theme', t);
    const url = new URL(window.location.href);
    if (t === 'native') url.searchParams.delete('t');
    else url.searchParams.set('t', t);
    window.history.replaceState(null, '', url);
  };

  const vtClass = theme === 'native' ? NATIVE_VT[variant] : `vt-${theme}`;
  const Active = { ledger: Ledger, paper: Paper, terminal: Terminal }[variant];
  return (
    <>
      <Active variant={variant} vtClass={vtClass} onSwitch={switchTo} />
      <CmdK variant={variant} vtClass={vtClass} theme={theme} onSwitch={switchTo} onTheme={themeTo} />
    </>
  );
}

export function VariantSwitch({
  variant,
  onSwitch,
  prefix = 'view:',
}: {
  variant: Variant;
  onSwitch: (v: Variant) => void;
  prefix?: string;
}) {
  return (
    <nav className="v-switch" aria-label="Page style">
      {prefix}{' '}
      {VARIANTS.map((v, i) => (
        <span key={v}>
          {i > 0 && ' · '}
          <button aria-pressed={variant === v} onClick={() => onSwitch(v)}>
            {v}
          </button>
        </span>
      ))}
      <span className="v-dice" title="A variant is chosen at random on each visit">
        (random on each visit)
      </span>
      <span className="v-kbd" aria-hidden="true">⌘K</span>
    </nav>
  );
}
