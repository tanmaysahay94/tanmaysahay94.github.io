import { RESUME_DATA, ScrambledText, linkify } from '../InteractiveResume';
import { VariantSwitch, type Variant } from './VariantSite';
import { ROLE_LINKS, PROFILE_LINKS } from './links';

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s);

export default function Paper({ variant, onSwitch }: { variant: Variant; onSwitch: (v: Variant) => void }) {
  const { contact, languages } = RESUME_DATA.profile;
  const work = RESUME_DATA.experience.filter((e) => e.type !== 'education');
  const education = RESUME_DATA.experience.find((e) => e.type === 'education');
  const kudos = RESUME_DATA.kudos.slice(0, 6);
  return (
    <main className="v-paper">
      <div className="col">
        <div className="title">
          <h1>
            Tanmay Sahay <span className="devnagari">· तन्मय</span>
          </h1>
          <div className="dev-sub">Reliability for AI Systems</div>
        </div>
        <div className="authorline">
          Software Engineer, SRE — Jules · <span className="aff">Google, Mountain View</span>
        </div>
        <div className="links">
          <a href={PROFILE_LINKS.github}>[github]</a>{' '}
          <a href={PROFILE_LINKS.linkedin}>[linkedin]</a>{' '}
          <a href={PROFILE_LINKS.jules}>[jules]</a>{' '}
          <button className="printlink" onClick={() => window.print()}>
            [pdf — print this page]
          </button>
        </div>
        <div className="contact-row">
          <ScrambledText text={contact.email} href={`mailto:${contact.email}`} />
          <ScrambledText text={contact.phone} href={`tel:${contact.phone}`} />
        </div>
        <VariantSwitch variant={variant} onSwitch={onSwitch} prefix="presentation —" />
        <div className="abstract">
          <b>Abstract.</b> {RESUME_DATA.profile.summary}
        </div>
        <h2>
          <span className="n">1</span>Positions
        </h2>
        {work.map((job) => (
          <div className="pub" key={job.id}>
            <div className="t">{job.role}</div>
            <div className="m">
              {job.company} · {job.period} · {job.location}
            </div>
            <div className="tldr">
              <b>tl;dr</b> — {linkify(job.description)}
            </div>
            <div className="tldr">
              {job.impact_points.map((p, i) => (
                <div key={i}>— {linkify(p)}</div>
              ))}
            </div>
            {ROLE_LINKS[job.id] && (
              <div className="br">
                {ROLE_LINKS[job.id].map((l) => (
                  <a key={l.url} href={l.url}>
                    [{l.label}]{' '}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        <h2>
          <span className="n">2</span>Methods &amp; instruments
        </h2>
        {RESUME_DATA.skills.map((cat) => (
          <div className="pub" key={cat.name}>
            <div className="tldr">
              <b>{cat.name.toLowerCase()}</b> — {cat.skills.join(', ')}.
            </div>
          </div>
        ))}
        <h2>
          <span className="n">3</span>Selected peer review
        </h2>
        <p style={{ fontSize: '14px', color: '#6e6759', fontStyle: 'italic', margin: '0 0 14px' }}>
          43 peer bonuses, 2019–2025. Six representative reviews:
        </p>
        {kudos.map((k) => (
          <blockquote key={k.id}>
            "{clip(k.text, 220)}"
            <span className="who">
              — {k.sender}, {k.team}, {k.year} · {k.theme}
            </span>
          </blockquote>
        ))}
        <h2>
          <span className="n">4</span>Education &amp; honors
        </h2>
        {education && (
          <div className="pub">
            <div className="t">{education.role}</div>
            <div className="m">
              {education.company} · {education.period} · {education.location}
            </div>
            <div className="tldr">
              {education.impact_points.map((p, i) => (
                <div key={i}>— {p}</div>
              ))}
            </div>
            {ROLE_LINKS.education && (
              <div className="br">
                {ROLE_LINKS.education.map((l) => (
                  <a key={l.url} href={l.url}>
                    [{l.label}]{' '}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
        <h2>
          <span className="n">5</span>Languages
        </h2>
        <div className="pub">
          {languages.families.map((f) => (
            <div className="tldr" key={f.name}>
              <b>{f.name.toLowerCase()}</b> —{' '}
              {f.languages.map((l) => `${l.name} (${l.label.toLowerCase()})`).join(', ')}.
            </div>
          ))}
          <div className="tldr">
            <b>scripts</b> — {languages.scripts.map((s) => s.name).join(', ')}.
          </div>
        </div>
        <h2>
          <span className="n">6</span>Citation
        </h2>
        <div className="bibtex">{`@misc{sahay2026,
  author = {Sahay, Tanmay},
  title  = {Reliability for AI Systems},
  year   = {2026},
  note   = {ICPC regionalist; polyglot (9 languages);
            reachable at the address above}
}`}</div>
      </div>
    </main>
  );
}
