import { useEffect, useRef, useState } from 'react';
import { RESUME_DATA } from '../InteractiveResume';
import { PROFILE_LINKS } from './links';
import type { Variant } from './VariantSite';

type Action = { id: string; label: string; hint: string; run: () => void };

// Client-only command palette (⌘K / Ctrl+K). Renders nothing until opened,
// so nothing here (including the mailto) ever appears in the SSG HTML.
export default function CmdK({
  variant,
  onSwitch,
}: {
  variant: Variant;
  onSwitch: (v: Variant) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery('');
        setIndex(0);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const close = () => setOpen(false);
  const actions: Action[] = [
    ...(['ledger', 'paper', 'terminal'] as const).map((v) => ({
      id: `view-${v}`,
      label: `${v === variant ? '● ' : ''}switch view: ${v}`,
      hint: 'view',
      run: () => {
        onSwitch(v);
        close();
      },
    })),
    {
      id: 'resume',
      label: 'download résumé (pdf)',
      hint: 'file',
      run: () => {
        window.location.assign(PROFILE_LINKS.resume);
        close();
      },
    },
    {
      id: 'email',
      label: 'email me',
      hint: 'contact',
      // Built at click time — never present in static HTML for scrapers.
      run: () => {
        window.location.assign(`mailto:${RESUME_DATA.profile.contact.email}`);
        close();
      },
    },
    { id: 'github', label: 'open github', hint: 'link', run: () => { window.open(PROFILE_LINKS.github, '_blank', 'noopener'); close(); } },
    { id: 'linkedin', label: 'open linkedin', hint: 'link', run: () => { window.open(PROFILE_LINKS.linkedin, '_blank', 'noopener'); close(); } },
    {
      id: 'copy-url',
      label: 'copy link to this view',
      hint: 'share',
      run: () => {
        navigator.clipboard?.writeText(`${window.location.origin}/?v=${variant}`);
        close();
      },
    },
  ];
  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));
  const active = Math.min(index, Math.max(filtered.length - 1, 0));

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    } else if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault();
      filtered[active].run();
    }
  };

  return (
    <div className={`v-cmdk vt-${variant === 'terminal' ? 'term' : variant}`} onClick={close} role="presentation">
      <div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          placeholder="Type a command…"
          aria-label="Filter commands"
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={onInputKey}
        />
        {filtered.length === 0 ? (
          <div className="empty">no matching command</div>
        ) : (
          <ul role="listbox" aria-label="Commands">
            {filtered.map((a, i) => (
              <li
                key={a.id}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setIndex(i)}
                onClick={a.run}
              >
                <span>{a.label}</span>
                <span className="hint">{a.hint}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
