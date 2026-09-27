import { RESUME_DATA } from '../InteractiveResume';
import { VariantSwitch } from './VariantSite';
import type { VariantProps } from './types';
import { PROFILE_LINKS } from './links';

// Reliability × Sabyasachi: the SRE status page in a heritage frame.
// Timeline scale runs 2017 → 2027; a "Present" role runs to the right edge,
// so nothing here depends on today's date (SSG and client render the same).
const SCALE_START = 2017;
const SCALE_END = 2027;
const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

// "Apr '25" → 2025.25
const point = (s: string) => {
  const m = s.trim().match(/^([A-Z][a-z]{2}) '(\d{2})$/);
  return m ? 2000 + Number(m[2]) + MONTHS[m[1]] / 12 : null;
};
const pretty = (s: string) => s.trim().replace(/^([A-Z][a-z]{2}) '(\d{2})$/, '$1 20$2').replace(/^Present$/, 'present');

const CITY: Record<string, string> = {
  'US-MTV': 'Mountain View',
  'CH-ZRH': 'Zurich',
  'UK-LON / CH-ZRH': 'London / Zurich',
  'NL-AMS': 'Amsterdam',
};

// Presentation labels per role; periods and places come from RESUME_DATA.
const ROWS: { id: string; label: string; org: string; tone: string }[] = [
  { id: 'google-gemini', label: 'LLM serving · Gemini & Vertex AI', org: 'Google DeepMind', tone: 'link' },
  { id: 'google-network', label: 'Network infrastructure', org: 'Google', tone: 'ok' },
  { id: 'google-switzerland', label: 'Cloud infrastructure · monitoring & alerting', org: 'Google', tone: 'gold' },
  { id: 'google-serverless', label: 'Serverless platform', org: 'Google · Cloud Run, Cloud Functions, App Engine', tone: 'ok' },
  { id: 'booking', label: 'Image services', org: 'Booking.com', tone: 'muted' },
];

const TICKS = [2017, 2019, 2021, 2023, 2025];
const pct = (y: number) => `${(((y - SCALE_START) / (SCALE_END - SCALE_START)) * 100).toFixed(2)}%`;

const email = () => window.location.assign(`mailto:${RESUME_DATA.profile.contact.email}`);

export default function Heritage({ variant, vtClass, onSwitch }: VariantProps) {
  const rows = ROWS.flatMap((r) => {
    const job = RESUME_DATA.experience.find((e) => e.id === r.id);
    if (!job) return [];
    const [from, to] = job.period.split(' - ');
    const start = point(from) ?? SCALE_START;
    const end = /present/i.test(to) ? SCALE_END : point(to) ?? start;
    return [{ ...r, job, from: pretty(from), to: pretty(to), left: pct(start), width: pct(SCALE_START + end - start) }];
  });
  const quote = RESUME_DATA.kudos.find((k) => /log4j/i.test(k.text)) ?? RESUME_DATA.kudos[0];
  const rec = RESUME_DATA.recognition;

  return (
    <main className={`v-heritage ${vtClass}`}>
      <div className="frame">
        <header className="top">
          <div className="site">tanmaysahay.com</div>
          <nav aria-label="Sections and profiles">
            <a href="#work">Work</a>
            <a href="#incidents">Incidents</a>
            <a href={PROFILE_LINKS.resume}>Résumé</a>
            <a href={PROFILE_LINKS.linkedin}>LinkedIn</a>
            <a href={PROFILE_LINKS.github}>GitHub</a>
          </nav>
        </header>

        <section className="hero">
          <div className="status">
            <span className="dot" aria-hidden="true" />
            All systems operational · on call since 2019
          </div>
          <div className="name">
            <h1>Tanmay Sahay</h1>
            <span className="dev" lang="hi">तन्मय</span>
          </div>
          <svg className="orn" width="300" height="24" viewBox="0 0 300 24" aria-hidden="true">
            <line x1="0" y1="12" x2="130" y2="12" />
            <rect x="142" y="4" width="16" height="16" transform="rotate(45 150 12)" />
            <circle cx="150" cy="12" r="3" />
            <line x1="170" y1="12" x2="300" y2="12" />
          </svg>
          <p className="lede">
            Site reliability engineer at Google. LLM serving for Gemini and Vertex AI, networks, serverless — kept
            up, and the pager kept quiet.
          </p>
          <div className="ctas">
            <a className="btn primary" href={PROFILE_LINKS.resume}>Download résumé</a>
            <button className="btn" onClick={email}>Email me</button>
          </div>
        </section>

        <section id="work" className="components" aria-labelledby="h-components">
          <div className="sec-head">
            <h2 id="h-components">Components</h2>
            <div className="label">uptime history · 2017 → now</div>
          </div>
          <div className="row ticks" aria-hidden="true">
            <div className="who" />
            <div className="track bare">
              {TICKS.map((y) => (
                <span key={y} style={{ left: pct(y) }}>{y}</span>
              ))}
            </div>
          </div>
          {rows.map((r) => (
            <div className="row" key={r.id}>
              <div className="who">
                <div className="role">{r.label}</div>
                <div className="meta">
                  {r.org} · {r.from} – {r.to} · {CITY[r.job.location] ?? r.job.location}
                </div>
              </div>
              <div className="track" role="img" aria-label={`${r.from} to ${r.to}`}>
                <div className={`bar ${r.tone}`} style={{ left: r.left, width: r.width }} />
              </div>
            </div>
          ))}
          <div className="path">
            <div className="label">incident path</div>
            <ol>
              {['page', 'LLM-assisted triage', 'gated actuation', 'resolved'].map((s) => (
                <li key={s}>
                  <span className="chip">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="incidents" aria-labelledby="h-incidents">
          <div className="sec-head">
            <h2 id="h-incidents">Past incidents</h2>
            <div className="label">resolved, with receipts</div>
          </div>
          <div className="cards">
            {RESUME_DATA.highlights.map((h) => (
              <article className="card" key={h.title}>
                <div className="tag">{h.tag}</div>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="two">
          <section aria-labelledby="h-off">
            <h2 id="h-off" className="ruled">Off the clock</h2>
            <div className="label">agent harnesses &amp; evaluation infrastructure</div>
            {RESUME_DATA.independent.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </section>
          <section aria-labelledby="h-words">
            <h2 id="h-words" className="ruled">In their words</h2>
            <div className="label">
              {rec.total} recognitions from {rec.colleagues} colleagues · {rec.span}
            </div>
            <blockquote>“{quote.text}”</blockquote>
            <div className="who-said">
              — {quote.sender.toLowerCase()}, {quote.team}, {quote.year}
            </div>
          </section>
        </div>

        <section aria-labelledby="h-before">
          <h2 id="h-before" className="ruled">Before all this</h2>
          <div className="honors">
            {RESUME_DATA.honors.map((h) => (
              <div key={h.title}>
                <div className="h-title">{h.title}</div>
                <div className="h-detail">{h.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="close">
          <div className="ask">Building something that has to stay up?</div>
          <div className="ctas">
            <button className="btn primary" onClick={email}>Email me</button>
            <a className="btn" href={PROFILE_LINKS.linkedin}>LinkedIn</a>
          </div>
        </footer>

        <VariantSwitch variant={variant} onSwitch={onSwitch} />
      </div>
    </main>
  );
}
