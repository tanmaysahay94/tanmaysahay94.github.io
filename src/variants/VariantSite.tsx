import { useEffect, useState } from 'react';
import './variants.css';
import Ledger from './Ledger';
import Paper from './Paper';
import Terminal from './Terminal';

export type Variant = 'ledger' | 'paper' | 'terminal';
const VARIANTS: Variant[] = ['ledger', 'paper', 'terminal'];

const isVariant = (v: string | null): v is Variant => VARIANTS.includes(v as Variant);

// SSG prerenders 'paper' (richest text for crawlers); the client re-rolls
// after hydration so every visit lands on a random variant. `?v=` pins one.
export default function VariantSite() {
  const [variant, setVariant] = useState<Variant>('paper');

  useEffect(() => {
    // queueMicrotask, not requestAnimationFrame: rAF is paused in unfocused
    // tabs, which would leave background-opened visits stuck on the SSG default.
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      const param = new URLSearchParams(window.location.search).get('v');
      setVariant(isVariant(param) ? param : VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);
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

  const Active = { ledger: Ledger, paper: Paper, terminal: Terminal }[variant];
  return <Active variant={variant} onSwitch={switchTo} />;
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
    </nav>
  );
}
