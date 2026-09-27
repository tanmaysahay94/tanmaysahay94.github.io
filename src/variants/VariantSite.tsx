import { useEffect, useState } from 'react';
import './variants.css';
import Heritage from './Heritage';
import Ledger from './Ledger';
import Paper from './Paper';
import Terminal from './Terminal';
import CmdK from './CmdK';
import { VARIANTS, NATIVE_VT, DEFAULT_VARIANT, isVariant, isTheme, type Variant, type Theme } from './types';


// SSG prerenders the default variant (Heritage) and every visitor sees it;
// `?v=` pins another variant. Theme (`?t=` / localStorage 'ts-theme')
// persists across visits.
export default function VariantSite() {
  const [variant, setVariant] = useState<Variant>(DEFAULT_VARIANT);
  const [theme, setTheme] = useState<Theme>('native');
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setPrefersDark(mq.matches);
    queueMicrotask(apply);
    // Safari <14 lacks addEventListener on MediaQueryList; without this guard
    // the mount throws and the whole tree unmounts (cross-vendor review 2026-07-13)
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
    type LegacyMQL = { addListener?: (f: () => void) => void; removeListener?: (f: () => void) => void };
    (mq as unknown as LegacyMQL).addListener?.(apply);
    return () => (mq as unknown as LegacyMQL).removeListener?.(apply);
  }, []);

  useEffect(() => {
    // queueMicrotask, not requestAnimationFrame: rAF is paused in unfocused
    // tabs, which would leave background-opened visits stuck on the SSG default.
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      if (isVariant(v)) setVariant(v);
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

  const vtClass =
    theme === 'native' ? NATIVE_VT[variant]
    : theme === 'auto' ? (prefersDark ? 'vt-dark' : 'vt-light')
    : `vt-${theme}`;
  const Active = { heritage: Heritage, ledger: Ledger, paper: Paper, terminal: Terminal }[variant];
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
      <span className="v-kbd" aria-hidden="true">⌘K</span>
    </nav>
  );
}
