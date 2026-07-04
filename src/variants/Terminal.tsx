import { RESUME_DATA, ScrambledText } from '../InteractiveResume';
import { VariantSwitch, type Variant } from './VariantSite';
import { ROLE_LINKS, PROFILE_LINKS } from './links';

const Prompt = ({ cmd }: { cmd: string }) => (
  <div>
    <span className="ps1">tanmay@prod:~$</span> <span className="cmd">{cmd}</span>
  </div>
);

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s);

// "Feb '26 - Present" → "2026–"
const yr = (period: string) => {
  const years = period.match(/'(\d{2})/g)?.map((m) => `20${m.slice(1)}`) ?? [];
  if (/Present/i.test(period)) return `${years[0] ?? period}–`;
  if (years.length === 2 && years[0] !== years[1]) return `${years[0]}–${years[1].slice(2)}`;
  return years[0] ?? period;
};

const LOCALES: Record<string, string> = {
  English: 'en_GB', Dutch: 'nl_NL', German: 'de_DE', French: 'fr_FR', Spanish: 'es_ES',
  Hindi: 'hi_IN', Urdu: 'ur_IN', Kannada: 'kn_IN', Sanskrit: 'sa_IN',
};

export default function Terminal({ variant, onSwitch }: { variant: Variant; onSwitch: (v: Variant) => void }) {
  const { contact, languages } = RESUME_DATA.profile;
  const work = RESUME_DATA.experience.filter((e) => e.type !== 'education');
  const education = RESUME_DATA.experience.find((e) => e.type === 'education');
  const current = work[0];
  const locales = languages.families
    .flatMap((f) => f.languages.map((l) => LOCALES[l.name] ?? l.name.toLowerCase()))
    .join('  ');
  return (
    <main className="v-term">
      <div className="term">
        <Prompt cmd="whoami" />
        <span className="out">
          <span className="amber">Tanmay Sahay</span> — Software Engineer, SRE{'\n'}
          Jules (Google's autonomous AI coder) · Mountain View
        </span>
        <Prompt cmd="uptime" />
        <span className="out">
          8+ years in production · Google (2019–) · Booking.com (2017–19){'\n'}
          load average: reliability, observability, operability
        </span>
        <Prompt cmd="ls -t work/" />
        <table>
          <tbody>
            {work.map((job) => (
              <tr key={job.id}>
                <td>{yr(job.period)}</td>
                <td>
                  {ROLE_LINKS[job.id]?.[0] ? (
                    <a href={ROLE_LINKS[job.id][0].url} className="amber">{job.id}/</a>
                  ) : (
                    <span className="amber">{job.id}/</span>
                  )}{' '}
                  <span className="dim">— {clip(`${job.role} · ${job.description}`, 96)}</span>
                  {(ROLE_LINKS[job.id] ?? []).slice(1).map((l) => (
                    <a key={l.url} href={l.url}> [{l.label}]</a>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Prompt cmd={`cat work/${current.id}/README`} />
        <span className="out">
          {current.impact_points.map((p, i) => (
            <span key={i}>
              <span className="dim">·</span> {p}
              {'\n'}
            </span>
          ))}
        </span>
        <Prompt cmd="cat skills.yaml" />
        <span className="out">
          {RESUME_DATA.skills.map((cat) => (
            <span key={cat.name}>
              <span className="amber">{cat.name.toLowerCase().replace(/[^a-z]+/g, '_')}:</span>{' '}
              [{cat.skills.join(', ')}]{'\n'}
            </span>
          ))}
        </span>
        <Prompt cmd='grep -c "peer-bonus" kudos.log' />
        <span className="out">
          <span className="amber">43</span>
        </span>
        <Prompt cmd="tail -3 kudos.log" />
        <span className="out">
          {RESUME_DATA.kudos.slice(0, 3).map((k) => (
            <span key={k.id}>
              <span className="dim">
                {k.year} {k.team.toLowerCase().replace(/\s+/g, '-')} {k.sender}:
              </span>{' '}
              "{clip(k.text, 130)}"{'\n'}
            </span>
          ))}
        </span>
        <Prompt cmd="cat education.txt" />
        <span className="out">
          {education ? (
            <>
              {education.company} · {education.role} · {education.period}
              {'\n'}
              {education.impact_points.slice(0, 3).map((p, i) => (
                <span key={i}>
                  <span className="dim">·</span> {p}
                  {'\n'}
                </span>
              ))}
            </>
          ) : null}
        </span>
        <Prompt cmd="locale -a" />
        <span className="out">{locales}</span>
        <Prompt cmd="systemctl status jules-reliability" />
        <span className="out">
          <span className="ok">● active (running)</span> since Feb 2026
        </span>
        <Prompt cmd="contact --unscramble" />
        <span className="out">
          <ScrambledText text={contact.email} href={`mailto:${contact.email}`} />{'\n'}
          <ScrambledText text={contact.phone} href={`tel:${contact.phone}`} />{'\n'}
          links: <a href={PROFILE_LINKS.github}>github/tanmaysahay94</a> ·{' '}
          <a href={PROFILE_LINKS.linkedin}>linkedin/tanmaysahay</a>
        </span>
        <Prompt cmd="open resume.pdf" />
        <span className="out">
          <span className="dim">no static pdf —</span>{' '}
          <a href={PROFILE_LINKS.resume}>rendering print-ready paper view → /?v=paper</a>
        </span>
        <Prompt cmd="switch --view" />
        <span className="out">
          <VariantSwitch variant={variant} onSwitch={onSwitch} prefix="" />
        </span>
        <div>
          <span className="ps1">tanmay@prod:~$</span> <span className="cursor" aria-hidden="true"></span>
        </div>
      </div>
      <div className="bar">
        <span className="seg">
          [<b>0</b>] tanmay@prod
        </span>
        <span className="seg">polyglot: en nl de fr es hi ur kn sa</span>
        <span className="seg">
          <b>SLO</b> 99.99% · MTV
        </span>
      </div>
    </main>
  );
}
