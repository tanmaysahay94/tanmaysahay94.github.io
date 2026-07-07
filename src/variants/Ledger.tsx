import { useState } from 'react';
import { RESUME_DATA, ScrambledText, linkify } from '../InteractiveResume';
import { VariantSwitch } from './VariantSite';
import type { VariantProps } from './types';
import { ROLE_LINKS, PROFILE_LINKS } from './links';

const Expand = ({ children, label = 'expand' }: { children: React.ReactNode; label?: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="expand" aria-expanded={open} onClick={() => setOpen(!open)}>
        [{open ? 'collapse' : label}]
      </button>
      {open && <div className="expanded">{children}</div>}
    </>
  );
};

// Compact "Feb '26 - Present" → "2026–"
const yr = (period: string) => {
  const years = period.match(/'(\d{2})/g)?.map((m) => `20${m.slice(1)}`) ?? [];
  if (/Present/i.test(period)) return `${years[0] ?? period}–`;
  if (years.length === 2 && years[0] !== years[1]) return `${years[0]}–${years[1].slice(2)}`;
  return years[0] ?? period;
};

export default function Ledger({ variant, vtClass, onSwitch }: VariantProps) {
  const { contact, languages } = RESUME_DATA.profile;
  const work = RESUME_DATA.experience;
  const kudos = RESUME_DATA.kudos;
  const allLangs = languages.families.flatMap((f) => f.languages.map((l) => l.name));
  return (
    <main className={`v-ledger ${vtClass}`}>
      <div className="col">
        <VariantSwitch variant={variant} onSwitch={onSwitch} />
        <h1>Tanmay Sahay</h1>
        <p className="role">
          Software Engineer, SRE — <a href="https://jules.google.com">Jules</a>, Google's autonomous AI coder · Mountain View
        </p>
        <p>{RESUME_DATA.profile.summary}</p>
        <h2>Work</h2>
        <ul>
          {work.map((job) => (
            <li key={job.id}>
              <span className="yr">{yr(job.period)}</span>
              <b>{job.role}</b> · {job.company} ({job.location}) — {linkify(job.description)}{' '}
              {(ROLE_LINKS[job.id] ?? []).map((l) => (
                <a className="lnk" key={l.url} href={l.url}>
                  [{l.label}]{' '}
                </a>
              ))}
              <Expand>
                <ul>
                  {job.impact_points.map((p, i) => (
                    <li key={i}>· {linkify(p)}</li>
                  ))}
                </ul>
                <span className="lnk">{job.skills.join(' · ')}</span>
              </Expand>
            </li>
          ))}
        </ul>
        <h2>Skills</h2>
        <ul>
          {RESUME_DATA.skills.map((cat) => (
            <li key={cat.name}>
              <b>{cat.name}</b> — {cat.skills.join(', ')}
            </li>
          ))}
        </ul>
        <h2>Peer recognition</h2>
        <p>
          43 peer bonuses since 2019 across Serverless, Network Infra, Vertex AI, and cross-team work. The ten
          most representative: <Expand label="show all ten">
            <ul>
              {kudos.map((k) => (
                <li key={k.id}>
                  · <b>{k.sender}</b> ({k.team}, {k.year}): "{k.text}"
                </li>
              ))}
            </ul>
          </Expand>
        </p>
        <h2>Languages</h2>
        <p>{allLangs.join(' · ')} — plus the Cyrillic script, for reasons.</p>
        <h2>Contact</h2>
        <div className="contact-row">
          <ScrambledText text={contact.email} href={`mailto:${contact.email}`} />
          <ScrambledText text={contact.phone} href={`tel:${contact.phone}`} />
          <a href={PROFILE_LINKS.github}>GitHub</a>
          <a href={PROFILE_LINKS.linkedin}>LinkedIn</a>
          <a href={PROFILE_LINKS.resume}>Résumé (pdf)</a>
        </div>
        <p className="foot">
          One page, three skins — this one is the ledger; a die is rolled on every visit.{' '}
          <a href="https://github.com/tanmaysahay94">Source</a>.
        </p>
      </div>
    </main>
  );
}
