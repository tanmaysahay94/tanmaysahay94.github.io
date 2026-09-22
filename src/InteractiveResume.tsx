/* eslint-disable react-refresh/only-export-components --
   Legacy component (replaced by src/variants/) kept as the canonical home of
   RESUME_DATA and ScrambledText, which the variants import. */
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { buildScramble, bubbleSortStep } from './scramble';
import {
  Search,
  Moon,
  Sun,
  Award,
  Briefcase,
  Code,
  Cpu,
  TrendingUp,
  Users,
  Zap,
  ExternalLink,
  Terminal,
  Server,
  Database,
  Github,
  Linkedin
} from 'lucide-react';

// --- Types & Interfaces ---

interface Kudo {
  id: string;
  sender: string;
  date: string;
  text: string;
  tags: string[];
  team: 'Vertex AI' | 'Network Infra' | 'Cloud Infra' | 'Serverless' | 'Booking' | 'Cross-team';
  theme: 'Technical Excellence' | 'Leadership' | 'Collaboration' | 'Incident Response' | 'Automation' | 'Mentoring' | 'Innovation';
  year: number;
  featured?: boolean;
}

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  impact_points: string[];
  skills: string[];
  type: 'work' | 'education';
}

interface SkillCategory {
  name: string;
  skills: string[];
  icon: React.ReactNode;
}

// --- Data Source (Grounded in User Files) ---

export const RESUME_DATA = {
  profile: {
    name: "Tanmay Sahay",
    title: "Software Engineer — Reliability for AI Systems",
    tagline: "Making Gemini and Vertex AI LLM serving reliable, observable, and operable at scale.",
    location: "Mountain View, CA",
    contact: {
      email: "tanmaysahay94@gmail.com",
      phone: "+1-650-705-7651",
      linkedin: "linkedin.com/in/tanmaysahay"
    },
    summary: "Customer-obsessed engineer with 8+ years of experience making service operability sustainable. Currently focused on reliability of Google DeepMind's Gemini models on Vertex AI — accelerator-backed LLM inference serving. Expert in automating complex infrastructure, reducing operational toil by >50%, and pioneering AI-powered troubleshooting. Proven track record of saving 30+ SWE-years through efficiency optimizations.",
    languages: {
      families: [
        {
          name: "Germanic",
          languages: [
            { name: "English", native: "English", emoji: "🇬🇧", proficiency: 5, label: "Native" },
            { name: "Dutch", native: "Nederlands", emoji: "🇳🇱", proficiency: 3, label: "Conversational" },
            { name: "German", native: "Deutsch", emoji: "🇩🇪", proficiency: 2, label: "Basic" },
          ]
        },
        {
          name: "Romance",
          languages: [
            { name: "French", native: "Français", emoji: "🇫🇷", proficiency: 3, label: "Conversational" },
            { name: "Spanish", native: "Español", emoji: "🇪🇸", proficiency: 2, label: "Basic" },
          ]
        },
        {
          name: "Indo-Aryan",
          languages: [
            { name: "Hindi", native: "हिन्दी", emoji: "🇮🇳", proficiency: 5, label: "Native" },
            { name: "Urdu", native: "اردو", emoji: "🇮🇳", proficiency: 3, label: "Conversational" },
            { name: "Kannada", native: "ಕನ್ನಡ", emoji: "🇮🇳", proficiency: 4, label: "Fluent" },
            { name: "Sanskrit", native: "संस्कृतम्", emoji: "🕉️", proficiency: 1, label: "Exposure" },
          ]
        },
      ],
      scripts: [{ name: "Cyrillic", native: "Кириллица", emoji: "🇷🇺", label: "Can read" }]
    }
  },
  metrics: [
    { label: "Peer Bonuses", value: "43", icon: <Award className="w-5 h-5" />, desc: "Recognized for impact & collaboration" },
    { label: "Impact", value: "30+", unit: "SWE-Years", icon: <Users className="w-5 h-5" />, desc: "Saved via Vertex Endpoint Health" },
    { label: "Latency", value: "50%", unit: "Reduction", icon: <Zap className="w-5 h-5" />, desc: "Image generation at Booking.com" },
    { label: "Adoption", value: "500+", unit: "Databases", icon: <Database className="w-5 h-5" />, desc: "Safe Spanner rollouts enabled" },
  ],
  skills: [
    { name: "Programming", skills: ["Python", "Go", "Java", "C++", "SQL", "Shell"], icon: <Code /> },
    { name: "SRE & Cloud", skills: ["Kubernetes", "Terraform", "Bazel", "GCP", "Incident Response", "Observability"], icon: <Server /> },
    { name: "AI & ML", skills: ["Vertex AI", "LLM Ops", "Gemini CLI", "AI Agents", "Model Serving", "TPU Fleet Mgmt"], icon: <Cpu /> },
    { name: "Tools", skills: ["Prodspec", "Spanner", "Bigtable", "Prometheus/Monarch"], icon: <Terminal /> }
  ] as SkillCategory[],
  experience: [
    {
      id: "google-gemini",
      company: "Google",
      role: "Software Engineer, SRE (Gemini & Vertex AI LLM serving · Google DeepMind)",
      period: "Apr '25 - Present",
      location: "US-MTV",
      type: "work",
      description: "Making Google Cloud's large language model offerings (Gemini, Veo, Imagen) more reliable. Check out cloud.google.com/vertex-ai",
      impact_points: [
        "Reliability owner for accelerator-backed inference serving at frontier-model scale — GPU/TPU fleet capacity, serving-stack rollouts, and the incident path for Gemini, Veo and Imagen traffic.",
        "Led the migration of Vertex AI's ML model-serving configurations to dedicated hermetic ML-Ops, removing a class of release-time serving outages and materially improving rollout safety.",
        "Automated the months-long turnup of Vertex AI in new regions, including accelerator capacity validation before traffic admission.",
        "Built a Gemini-powered incident framework that cuts MTTx through LLM-assisted triage and gated actuation — an agentic system running against live production."
      ],
      skills: ["LLM Serving", "GPU/TPU Capacity", "ML-Ops", "Reliability", "Incident Response", "Automation", "Python", "Go"]
    },
    {
      id: "google-network",
      company: "Google",
      role: "Software Engineer, SRE (Network Infrastructure)",
      period: "Feb '24 - Apr '25",
      location: "US-PIT",
      type: "work",
      description: "Ensuring reliability for Google's global backbone network telemetry and monitoring systems.",
      impact_points: [
        "Navigated chaotic environment with constantly changing requirements while maintaining system stability.",
        "Successfully collaborated with NetInfra Telemetry teams to improve network observability.",
        "Built tooling to enhance network monitoring and alerting capabilities.",
        "Contributed to infrastructure supporting Google's global network operations."
      ],
      skills: ["Networking", "Telemetry", "Observability", "Collaboration", "Python"]
    },
    {
      id: "google-switzerland",
      company: "Google",
      role: "Software Engineer, SRE (Cloud Infrastructure)",
      period: "Feb '23 - Feb '24",
      location: "CH-ZRH",
      type: "work",
      description: "Continued driving reliability improvements and tooling development from Zurich.",
      impact_points: [
        "Continued development and expansion of Khoj (InvDash), scaling adoption across Google SRE teams.",
        "Mentored junior engineers and drove knowledge transfer across regions.",
        "Contributed to cross-functional infrastructure reliability initiatives.",
        "Prepared for and executed smooth transition to US-based Network Infrastructure team."
      ],
      skills: ["Mentoring", "Tooling", "Cross-team Collaboration", "Infrastructure"]
    },
    {
      id: "google-serverless",
      company: "Google",
      role: "Software Engineer, SRE (Serverless Platform)",
      period: "Mar '19 - Feb '23",
      location: "UK-LON / CH-ZRH",
      type: "work",
      description: "Enhanced reliability for Cloud Run, Cloud Functions, and App Engine.",
      impact_points: [
        "Reduced team's oncall load by over 50% through actionable metrics and democratization of data.",
        "Enabled safe, slow rollouts for 500+ Spanner databases, preventing global outages.",
        "Created 'Khoj' (InvDash) in 2021 — an automated incident root-causing system now used Google-wide and still actively maintained.",
        "Led Log4j Code Red response for Serverless products."
      ],
      skills: ["Serverless", "Spanner", "Incident Management", "Mentoring"]
    },
    {
      id: "khoj-project",
      company: "Google (Internal Project)",
      role: "Creator & Lead Developer — Khoj (InvDash)",
      period: "2021 - Present",
      location: "Global",
      type: "work",
      description: "Built and continuously evolved an automated incident investigation and root-causing system.",
      impact_points: [
        "Conceived and built Khoj in 2021 to automate tedious incident root-cause analysis.",
        "System correlates logs, metrics, and change events to surface probable causes during outages.",
        "Adopted Google-wide across multiple SRE teams, significantly reducing Mean Time To Diagnose (MTTD).",
        "Continuously maintained and enhanced over 4+ years, adapting to new infrastructure patterns."
      ],
      skills: ["Incident Response", "Automation", "Data Correlation", "Python", "Observability"]
    },
    {
      id: "booking",
      company: "Booking.com",
      role: "Software Developer",
      period: "Jun '17 - Feb '19",
      location: "NL-AMS",
      type: "work",
      description: "Machine Learning Services & Image Infrastructure.",
      impact_points: [
        "Reduced image serving latency by 50% and storage costs by 80% via on-the-fly resizing service.",
        "Built ML platform features used by 200+ Data Scientists.",
        "Migrated image building pipelines to Google Cloud Dataproc."
      ],
      skills: ["Java", "Machine Learning", "Optimization", "Distributed Systems"]
    },
    {
      id: "education",
      company: "IIIT Hyderabad",
      role: "B.Tech in Computer Science",
      period: "2013 - 2017",
      location: "Hyderabad, India",
      type: "education",
      description: "Premier research university, ranked among top CS programs in India.",
      impact_points: [
        "ACM ICPC Regional Finalist (2014, 2015) — among top competitive programmers in Asia.",
        "JEE Mains Rank 719 (Top 0.05%) out of 1.4M candidates nationwide.",
        "National Talent Scholar — recognized for academic excellence.",
        "CodeChef Campus Chapter Ambassador — organized coding competitions.",
        "Teaching Assistant for Algorithms & Data Structures courses."
      ],
      skills: ["Algorithms", "Data Structures", "Competitive Programming", "Problem Solving"]
    }
  ] as ExperienceItem[],
  // Peer recognition. The source list holds internal IDs, codenames and
  // colleague names, so only aggregates and a few clean verbatim quotes are
  // public. Quotes are attributed by team + year, never by name.
  recognition: {
    total: 43,
    colleagues: 37,
    span: "2019–2025",
    themes: [
      { theme: "collaboration", count: 12 },
      { theme: "technical excellence", count: 10 },
      { theme: "incident response", count: 8 },
      { theme: "mentoring", count: 6 },
      { theme: "leadership", count: 4 },
      { theme: "innovation", count: 2 },
      { theme: "automation", count: 1 }
    ]
  },
  kudos: [
    {
      id: "kudo-1",
      sender: "Colleague",
      date: "2025",
      text: "Thanks Tanmay for introducing me and keeping me up to date with all the innovative things happening in the world of AI. Your presentation on gemini-cli and how to prompt was awesome. Your push towards using AI to automate our operations and investigations will be really impactful for the team.",
      tags: ["AI/ML", "Innovation", "Knowledge Sharing"],
      team: "Vertex AI",
      theme: "Innovation",
      year: 2025,
      featured: true
    },
    {
      id: "kudo-2",
      sender: "Colleague",
      date: "2022",
      text: "Thank you for going above and beyond the call of duty in your response to the log4j security vulnerabilities in December 2021. Your commitment to securing Google and our customers is truly appreciated!",
      tags: ["Security", "Incident Response"],
      team: "Serverless",
      theme: "Incident Response",
      year: 2022,
      featured: true
    },
    {
      id: "kudo-3",
      sender: "Colleague",
      date: "2022",
      text: "Being oncall in an understaffed rotation takes time away from your project work and personal life. Thank you Tanmay for enabling our team to persevere through this challenging time!",
      tags: ["Oncall", "Teamwork"],
      team: "Serverless",
      theme: "Collaboration",
      year: 2022,
      featured: true
    },
    {
      id: "kudo-4",
      sender: "Colleague",
      date: "2019",
      text: "For collaborating with Cloud Functions SREs to ensure alignment and shared understanding of observability requirements during the GCF v2 launch preparation.",
      tags: ["Observability", "Launch Prep"],
      team: "Serverless",
      theme: "Collaboration",
      year: 2019,
      featured: true
    }
  ] as Kudo[]
};

// --- Layman Mode Translations ---
// Maps technical jargon to accessible language for non-technical audiences

const LAYMAN_CONTENT = {
  profile: {
    title: "Software Engineer making AI systems reliable",
    tagline: "Making Gemini and Vertex AI LLM serving reliable, observable, and operable at scale.",
    summary: "Dedicated engineer with 8+ years of experience keeping critical services running. Currently focused on making Google DeepMind's Gemini AI models on Vertex AI reliable and well-monitored. I build tools that automate complex tasks, reduce repetitive work by over 50%, and use AI to solve problems faster. My work has saved the equivalent of 30+ years of engineering effort through efficiency improvements."
  },
  metrics: [
    { label: "Peer Bonuses", value: "43", desc: "Recognized by colleagues for teamwork & impact" },
    { label: "Impact", value: "30+", unit: "Years Saved", desc: "Engineering time saved through my tools" },
    { label: "Speed", value: "50%", unit: "Faster", desc: "Made image loading twice as fast" },
    { label: "Scale", value: "500+", unit: "Databases", desc: "Enabled safe updates across systems" },
  ],
  experience: {
    "google-gemini": {
      role: "Engineer keeping Google DeepMind's AI models (Gemini, Veo, Imagen) reliable",
      description: "Keeping Google Cloud's large language model offerings running smoothly for customers.",
      impact_points: [
        "Responsible for keeping the AI chips and servers that answer Gemini, Veo and Imagen requests reliable.",
        "Moved how AI models are configured for serving onto a safer, self-contained release process, removing a whole class of release-day outages.",
        "Automated the months-long setup of Vertex AI in new regions, including checking AI-chip capacity before traffic arrives.",
        "Built a Gemini-powered incident assistant that helps engineers diagnose and fix outages faster."
      ]
    },
    "google-network": {
      role: "Engineer ensuring Google's network stays healthy",
      description: "Keeping Google's global internet infrastructure monitored and reliable.",
      impact_points: [
        "Worked effectively in a fast-changing environment while keeping systems stable.",
        "Collaborated with network teams to improve visibility into system health.",
        "Built tools to better monitor and alert on network issues.",
        "Contributed to infrastructure supporting Google's worldwide operations."
      ]
    },
    "google-switzerland": {
      role: "Engineer building tools for system reliability",
      description: "Continued building reliability tools and mentoring from Google's Zurich office.",
      impact_points: [
        "Expanded an investigation tool I created, now used across Google engineering teams.",
        "Mentored junior engineers and shared knowledge across international offices.",
        "Contributed to company-wide reliability improvement projects.",
        "Prepared for and executed a smooth transition to a new US-based team."
      ]
    },
    "google-serverless": {
      role: "Engineer for Google Cloud's app hosting services",
      description: "Made Cloud Run, Cloud Functions, and App Engine more reliable.",
      impact_points: [
        "Reduced on-call emergency work by over 50% by making data more accessible.",
        "Enabled safe, gradual updates for 500+ databases, preventing major outages.",
        "Created 'Khoj' — an automated problem-investigation tool now used company-wide and still maintained today.",
        "Led the emergency response to a critical security vulnerability (Log4j) for our products."
      ]
    },
    "khoj-project": {
      role: "Creator of automated investigation tool",
      description: "Built and continuously improved a tool that automatically finds the cause of system problems.",
      impact_points: [
        "Conceived and built Khoj in 2021 to automate tedious problem investigation.",
        "The tool connects logs, measurements, and changes to surface likely causes during outages.",
        "Adopted company-wide across engineering teams, significantly speeding up problem diagnosis.",
        "Continuously maintained and improved over 4+ years, adapting to new systems."
      ]
    },
    "booking": {
      role: "Software Developer",
      description: "Built tools for machine learning and image processing.",
      impact_points: [
        "Made images load 50% faster and reduced storage costs by 80% with on-demand image resizing.",
        "Built platform features used by 200+ data scientists.",
        "Migrated image processing to Google Cloud, improving scalability."
      ]
    },
    "education": {
      role: "Bachelor's in Computer Science",
      description: "Premier research university, ranked among top computer science programs in India.",
      impact_points: [
        "ACM ICPC Regional Finalist (2014, 2015) — top competitive programmer in Asia.",
        "JEE Mains Rank 719 (Top 0.05%) out of 1.4 million students nationwide.",
        "National Talent Scholar — recognized for academic excellence.",
        "CodeChef Campus Chapter Ambassador — organized coding competitions.",
        "Teaching Assistant for Algorithms & Data Structures courses."
      ]
    }
  },
  skills: {
    "Programming": { name: "Programming Languages", skills: ["Python", "Go", "Java", "C++", "SQL", "Shell Scripts"] },
    "SRE & Cloud": { name: "Reliability & Cloud", skills: ["Container Orchestration", "Infrastructure as Code", "Build Systems", "Google Cloud", "Emergency Response", "System Monitoring"] },
    "AI & ML": { name: "AI & Machine Learning", skills: ["AI Platform Management", "Large Language Models", "AI Assistants", "Model Deployment", "GPU/TPU Management"] },
    "Tools": { name: "Data & Tools", skills: ["Configuration Management", "Distributed Databases", "Key-Value Stores", "Metrics & Monitoring"] }
  }
};

// --- Helpers ---

export const linkify = (text: string): React.ReactNode => {
  const url = 'cloud.google.com/vertex-ai';
  const idx = text.indexOf(url);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <a href={`https://${url}`} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{url}</a>
      {text.slice(idx + url.length)}
    </>
  );
};

// --- Components ---

const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`nb-card bg-white dark:bg-slate-800 rounded-lg p-6 ${className}`}
  >
    {children}
  </div>
);

// Colored keyword highlights in titles (à la anuragxel.github.io)
const HighlightedTitle = ({ text }: { text: string }) => {
  const re = /(Reliability|reliable|AI [Ss]ystems)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const isReliability = /^[Rr]elia/.test(m[0]);
    // Emberline roles: reliability = dusty steel (dependability), AI = clay warmth
    parts.push(
      <span
        key={m.index}
        className={isReliability
          ? 'text-purple-600 dark:text-purple-400 font-semibold'
          : 'text-blue-600 dark:text-blue-400 font-semibold'}
      >
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
};

const Badge = ({ children, color = "blue" }: { children: React.ReactNode, color?: "blue" | "green" | "purple" | "orange" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50",
    orange: "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

// Filter chip component
const FilterChip = ({
  label,
  active,
  onClick,
  count
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
    }`}
  >
    {label} {count !== undefined && <span className="ml-1 opacity-70">({count})</span>}
  </button>
);

// Scramble/unscramble animation to protect PII from bots
// Adapted from scramble.js by Jeff Donahue (2011)
export const ScrambledText = ({ text, href }: { text: string; href: string }) => {
  const [state, setState] = useState(() => {
    const init = buildScramble(text);
    return { display: init.display, indices: init.indices, isRevealed: false };
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bookmarkRef = useRef<[number]>([0]);
  const changedRef = useRef<[boolean]>([false]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startUnscramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    bookmarkRef.current = [0];
    changedRef.current = [false];

    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.isRevealed) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        const result = bubbleSortStep(
          { display: prev.display, indices: prev.indices },
          bookmarkRef.current,
          changedRef.current,
        );
        if (result.done) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return { display: result.state.display, indices: result.state.indices, isRevealed: true };
        }
        return { display: result.state.display, indices: result.state.indices, isRevealed: false };
      });
    }, 12);
  }, []);

  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm font-mono text-xs sm:text-sm">
      <ExternalLink size={14} />
      {state.isRevealed ? (
        <a
          href={href}
          target={!href.startsWith('mailto:') && !href.startsWith('tel:') ? '_blank' : undefined}
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {state.display}
        </a>
      ) : (
        <>
          <span>{state.display}</span>
          {' '}
          <button
            onClick={startUnscramble}
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-xs"
          >
            unscramble
          </button>
        </>
      )}
    </span>
  );
};

export default function InteractiveResume() {
  const [darkMode, setDarkMode] = useState(true);
  const [techSpeak, setTechSpeak] = useState(true); // true = technical, false = layman
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'experience' | 'skills' | 'kudos'>('all');
  const [kudosTeamFilter, setKudosTeamFilter] = useState<string | null>(null);
  const [kudosThemeFilter, setKudosThemeFilter] = useState<string | null>(null);
  const [kudosYearFilter, setKudosYearFilter] = useState<number | null>(null);
  const [showAllKudos, setShowAllKudos] = useState(false);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Search Logic
  const filteredExperience = useMemo(() => {
    if (!searchQuery) return RESUME_DATA.experience;
    const lowerQ = searchQuery.toLowerCase();
    return RESUME_DATA.experience.filter(item =>
      item.role.toLowerCase().includes(lowerQ) ||
      item.company.toLowerCase().includes(lowerQ) ||
      item.description.toLowerCase().includes(lowerQ) ||
      item.skills.some(s => s.toLowerCase().includes(lowerQ))
    );
  }, [searchQuery]);

  // Kudos filter options (derived from data)
  const kudosFilterOptions = useMemo(() => {
    const teams = [...new Set(RESUME_DATA.kudos.map(k => k.team))];
    const themes = [...new Set(RESUME_DATA.kudos.map(k => k.theme))];
    const years = [...new Set(RESUME_DATA.kudos.map(k => k.year))].sort((a, b) => b - a);
    return { teams, themes, years };
  }, []);

  // Count kudos per filter
  const kudosCounts = useMemo(() => {
    const teamCounts: Record<string, number> = {};
    const themeCounts: Record<string, number> = {};
    const yearCounts: Record<number, number> = {};

    RESUME_DATA.kudos.forEach(k => {
      teamCounts[k.team] = (teamCounts[k.team] || 0) + 1;
      themeCounts[k.theme] = (themeCounts[k.theme] || 0) + 1;
      yearCounts[k.year] = (yearCounts[k.year] || 0) + 1;
    });

    return { teamCounts, themeCounts, yearCounts };
  }, []);

  const filteredKudos = useMemo(() => {
    let filtered = RESUME_DATA.kudos;

    // Apply search query
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.text.toLowerCase().includes(lowerQ) ||
        item.tags.some(t => t.toLowerCase().includes(lowerQ)) ||
        item.sender.toLowerCase().includes(lowerQ) ||
        item.team.toLowerCase().includes(lowerQ) ||
        item.theme.toLowerCase().includes(lowerQ)
      );
    }

    // Apply team filter
    if (kudosTeamFilter) {
      filtered = filtered.filter(k => k.team === kudosTeamFilter);
    }

    // Apply theme filter
    if (kudosThemeFilter) {
      filtered = filtered.filter(k => k.theme === kudosThemeFilter);
    }

    // Apply year filter
    if (kudosYearFilter) {
      filtered = filtered.filter(k => k.year === kudosYearFilter);
    }

    return filtered;
  }, [searchQuery, kudosTeamFilter, kudosThemeFilter, kudosYearFilter]);

  // Show featured by default, or all if filters active or showAllKudos toggled
  const displayedKudos = useMemo(() => {
    const hasActiveFilters = kudosTeamFilter || kudosThemeFilter || kudosYearFilter || searchQuery;
    if (hasActiveFilters || showAllKudos) {
      return filteredKudos;
    }
    // Show featured kudos by default (diverse selection)
    return filteredKudos.filter(k => k.featured);
  }, [filteredKudos, kudosTeamFilter, kudosThemeFilter, kudosYearFilter, searchQuery, showAllKudos]);

  const clearKudosFilters = () => {
    setKudosTeamFilter(null);
    setKudosThemeFilter(null);
    setKudosYearFilter(null);
    setShowAllKudos(false);
  };

  const filteredSkills = useMemo(() => {
    if (!searchQuery) return RESUME_DATA.skills;
    const lowerQ = searchQuery.toLowerCase();
    return RESUME_DATA.skills.map(cat => ({
      ...cat,
      skills: cat.skills.filter(s => s.toLowerCase().includes(lowerQ))
    })).filter(cat => cat.skills.length > 0);
  }, [searchQuery]);


  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans antialiased ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>

      {/* Aurora Borealis background */}
      <div className="aurora"><div className="aurora-layer" /></div>

      {/* Header / Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/90 border-b border-gray-200 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-2 text-white shadow-md">
                <Terminal size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block text-gray-900 dark:text-white">Tanmay Sahay</span>
            </div>

            <div className="flex-1 max-w-md mx-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-full leading-5 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 sm:text-sm transition-all"
                  placeholder="Search skills, impact, or kudos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Layman/Tech Toggle */}
            <button
              onClick={() => setTechSpeak(!techSpeak)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                techSpeak
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
              }`}
              aria-label={techSpeak ? 'Switch to simple language' : 'Switch to technical language'}
              title={techSpeak ? 'Click for simpler language' : 'Click for technical details'}
            >
              <Code size={14} />
              {techSpeak ? 'Tech' : 'Simple'}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* Hero Section */}
        <section className="text-center space-y-6 animate-fadeIn py-4">
          <img
            src="/avatar.jpg"
            alt="Tanmay Sahay"
            width={460}
            height={460}
            className="nb-frame mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover bg-white dark:bg-slate-800"
          />

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#8a5a1e] via-[#c15f3c] to-[#9d4f5e] dark:from-[#e6b877] dark:via-[#e08b66] dark:to-[#c15f3c] bg-clip-text text-transparent pb-2">
              {RESUME_DATA.profile.name}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-slate-300 font-medium">
              <HighlightedTitle text={techSpeak ? RESUME_DATA.profile.title : LAYMAN_CONTENT.profile.title} />
            </p>
          </div>

          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
            {techSpeak ? RESUME_DATA.profile.tagline : LAYMAN_CONTENT.profile.tagline}
          </p>

          <div className="nb-card inline-block max-w-xl rounded-lg bg-indigo-50/90 dark:bg-indigo-950/50 px-5 py-3 text-sm text-left text-gray-700 dark:text-slate-300">
            <span className="font-bold text-gray-900 dark:text-white">Let's talk:</span>{' '}
            always up for conversations about reliability, AI infrastructure, and systems
            that don't page you at 3 a.m.
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/tanmaysahay94"
              target="_blank"
              rel="noreferrer"
              className="nb-card inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-indigo-600 text-white px-4 py-2 text-sm font-semibold"
            >
              <Github size={16} /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/tanmaysahay"
              target="_blank"
              rel="noreferrer"
              className="nb-card inline-flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 px-4 py-2 text-sm font-semibold"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-slate-400">
            {Object.entries(RESUME_DATA.profile.contact).map(([key, val]) => {
              const href = key === 'email' ? `mailto:${val}` : key === 'phone' ? `tel:${val}` : `https://${val}`;
              return <ScrambledText key={key} text={val} href={href} />;
            })}
          </div>

          {/* Language Family Tree — expands on hover */}
          <div className="group/lang relative max-w-xl mx-auto text-xs text-gray-500 dark:text-slate-500">
            {/* Collapsed: simple inline summary */}
            <div className="flex flex-wrap justify-center gap-1.5 group-hover/lang:opacity-0 group-hover/lang:pointer-events-none transition-opacity duration-200">
              <span className="font-medium">Polyglot:</span>
              {RESUME_DATA.profile.languages.families.flatMap(f => f.languages).map((lang, idx, arr) => (
                <span key={lang.name}>{lang.name}{idx < arr.length - 1 ? ' · ' : ''}</span>
              ))}
              <span className="text-gray-400 dark:text-slate-600 italic ml-1">hover to explore</span>
            </div>
            {/* Expanded: full family tree */}
            <div className="absolute left-0 right-0 top-0 opacity-0 pointer-events-none group-hover/lang:opacity-100 group-hover/lang:pointer-events-auto transition-opacity duration-200 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-gray-200/50 dark:border-slate-700/50">
              <div className="space-y-1.5">
                {RESUME_DATA.profile.languages.families.map((family, fi) => (
                  <div key={family.name} className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-slate-600 select-none shrink-0 font-mono">{fi < RESUME_DATA.profile.languages.families.length - 1 ? '├─' : '└─'}</span>
                    <span className="text-gray-400 dark:text-slate-600 w-16 shrink-0 text-right font-medium">{family.name}</span>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {family.languages.map((lang) => (
                        <span key={lang.name} className="flex items-center gap-1" title={lang.label}>
                          {lang.emoji && <span>{lang.emoji}</span>}
                          <span className="text-gray-600 dark:text-slate-400">{lang.name}</span>
                          <span className="text-gray-400 dark:text-slate-600 italic">({lang.native})</span>
                          <span className="flex gap-px">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className={`inline-block w-1.5 h-1.5 rounded-full ${i < lang.proficiency ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-200 dark:bg-slate-700'}`} />
                            ))}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {RESUME_DATA.profile.languages.scripts.map((script) => (
                  <div key={script.name} className="flex items-start gap-2">
                    <span className="text-gray-400 dark:text-slate-600 select-none shrink-0 font-mono">{'  '}</span>
                    <span className="text-gray-400 dark:text-slate-600 w-16 shrink-0 text-right font-medium">Scripts</span>
                    {script.emoji && <span>{script.emoji}</span>}
                    <span className="text-gray-600 dark:text-slate-400">{script.name}</span>
                    <span className="text-gray-400 dark:text-slate-600 italic">({script.native})</span>
                    <span className="text-gray-400 dark:text-slate-500">✓</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {RESUME_DATA.metrics.map((metric, idx) => {
            const displayMetric = techSpeak ? metric : { ...metric, ...LAYMAN_CONTENT.metrics[idx] };
            return (
              <Card key={idx} className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl mb-4 text-blue-600 dark:text-blue-400 shadow-sm">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {displayMetric.value}<span className="text-sm font-medium text-gray-500 dark:text-slate-400 ml-1">{displayMetric.unit}</span>
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-slate-300">{displayMetric.label}</div>
                <div className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">{displayMetric.desc}</div>
              </Card>
            );
          })}
        </section>

        {/* Tab Navigation */}
        <div id="content-tabs" className="flex justify-center border-b border-gray-200 dark:border-slate-700 scroll-mt-20">
          {(['all', 'experience', 'skills', 'kudos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold capitalize transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Experience Timeline */}
        {(activeTab === 'all' || activeTab === 'experience') && (
          <section className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Briefcase className="text-blue-600 dark:text-blue-400" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience Map</h2>
            </div>

            <div className="relative border-l-2 border-gray-200 dark:border-slate-700 ml-4 md:ml-6 space-y-12">
              {filteredExperience.map((job) => {
                const laymanJob = LAYMAN_CONTENT.experience[job.id as keyof typeof LAYMAN_CONTENT.experience];
                const displayRole = techSpeak ? job.role : (laymanJob?.role || job.role);
                const displayDesc = techSpeak ? job.description : (laymanJob?.description || job.description);
                const displayPoints = techSpeak ? job.impact_points : (laymanJob?.impact_points || job.impact_points);

                return (
                  <div key={job.id} className="relative pl-8 md:pl-12">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[11px] top-0 bg-gray-50 dark:bg-slate-900 p-1 rounded-full">
                      <div className={`w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 ${job.type === 'work' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`} />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.company}</h3>
                        <div className="text-lg text-blue-600 dark:text-blue-400 font-semibold">{displayRole}</div>
                      </div>
                      <div className="text-right mt-1 sm:mt-0">
                        <div className="text-sm font-mono text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded inline-block">{job.period}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">{job.location}</div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-slate-300 mb-4 italic border-l-2 border-gray-200 dark:border-slate-600 pl-3">
                      {linkify(displayDesc)}
                    </p>

                    <ul className="space-y-2.5 mb-4">
                      {displayPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-gray-700 dark:text-slate-300">
                          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{linkify(point)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(skill => (
                        <Badge key={skill} color="blue">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredExperience.length === 0 && (
                <div className="pl-12 text-gray-500 dark:text-slate-500 italic">No experience found matching "{searchQuery}"</div>
              )}
            </div>
          </section>
        )}

        {/* Skills Matrix */}
        {(activeTab === 'all' || activeTab === 'skills') && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Cpu className="text-purple-600 dark:text-purple-400" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills & Technologies</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSkills.map((category) => {
                const laymanCat = LAYMAN_CONTENT.skills[category.name as keyof typeof LAYMAN_CONTENT.skills];
                const displayName = techSpeak ? category.name : (laymanCat?.name || category.name);
                const displaySkills = techSpeak ? category.skills : (laymanCat?.skills || category.skills);

                return (
                  <Card key={category.name} className="flex flex-col h-full hover:border-purple-300 dark:hover:border-purple-500">
                    <div className="flex items-center gap-3 mb-4 text-gray-900 dark:text-white font-semibold">
                      <div className="p-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-lg text-gray-600 dark:text-slate-300 shadow-sm">
                        {category.icon}
                      </div>
                      {displayName}
                    </div>
                    <div className="flex flex-wrap gap-2 content-start">
                      {displaySkills.map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 text-sm bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Social Proof (Kudos) */}
        {(activeTab === 'all' || activeTab === 'kudos') && (
          <section className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-slate-800/30 dark:to-slate-800/10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 border-y border-amber-100/80 dark:border-slate-700">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-orange-900/20 rounded-lg">
                    <Users className="text-amber-600 dark:text-orange-400" size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Peer Recognition</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                      {RESUME_DATA.recognition.total} peer bonuses • Showing {displayedKudos.length}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700">
                  Validated Google Peer Bonus Data
                </div>
              </div>

              {/* Filter Controls */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="space-y-4">
                  {/* Team Filter */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">By Team</div>
                    <div className="flex flex-wrap gap-2">
                      {kudosFilterOptions.teams.map(team => (
                        <FilterChip
                          key={team}
                          label={team}
                          active={kudosTeamFilter === team}
                          onClick={() => setKudosTeamFilter(kudosTeamFilter === team ? null : team)}
                          count={kudosCounts.teamCounts[team]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Theme Filter */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">By Theme</div>
                    <div className="flex flex-wrap gap-2">
                      {kudosFilterOptions.themes.map(theme => (
                        <FilterChip
                          key={theme}
                          label={theme}
                          active={kudosThemeFilter === theme}
                          onClick={() => setKudosThemeFilter(kudosThemeFilter === theme ? null : theme)}
                          count={kudosCounts.themeCounts[theme]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">By Year</div>
                    <div className="flex flex-wrap gap-2">
                      {kudosFilterOptions.years.map(year => (
                        <FilterChip
                          key={year}
                          label={String(year)}
                          active={kudosYearFilter === year}
                          onClick={() => setKudosYearFilter(kudosYearFilter === year ? null : year)}
                          count={kudosCounts.yearCounts[year]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-700">
                    <button
                      onClick={() => setShowAllKudos(!showAllKudos)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showAllKudos
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {showAllKudos ? 'Showing All' : 'Show All Kudos'}
                    </button>
                    {(kudosTeamFilter || kudosThemeFilter || kudosYearFilter) && (
                      <button
                        onClick={clearKudosFilters}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Kudos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedKudos.map((kudo) => (
                  <Card key={kudo.id} className="relative">
                    <div className="absolute top-4 right-4 text-amber-100 dark:text-slate-700">
                      <Award size={40} />
                    </div>

                    <div className="mb-3">
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{kudo.sender}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-500">{kudo.date}</div>
                    </div>

                    {/* Team & Theme badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                        {kudo.team}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                        {kudo.theme}
                      </span>
                    </div>

                    <p className="nb-quote text-gray-700 dark:text-slate-300 text-sm leading-relaxed mb-4 relative z-10 italic">
                      "{kudo.text}"
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-slate-700">
                      {kudo.tags.map(tag => (
                        <Badge key={tag} color="orange">#{tag}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {displayedKudos.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-slate-600 mb-2">
                    <Award size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-500 dark:text-slate-500">No kudos found matching your filters.</p>
                  <button
                    onClick={clearKudosFilters}
                    className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* Floating section-nav pill (à la anuragxel.github.io) */}
      <nav
        aria-label="Section navigation"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-50"
      >
        <div className="nb-frame flex items-center gap-1 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur px-2 py-1.5">
          {([
            ['all', '🏠', 'Home'],
            ['experience', '⚡', 'Experience'],
            ['skills', '🛠️', 'Skills'],
            ['kudos', '💬', 'Kudos'],
          ] as const).map(([tab, emoji, label]) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                document.getElementById('content-tabs')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-gray-900 text-white dark:bg-indigo-600'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
              aria-label={`Show ${label} section`}
            >
              <span aria-hidden="true">{emoji}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            Built with React & Tailwind CSS. Grounded in verified career documents.
          </p>
          <div className="text-sm text-gray-500 dark:text-slate-500">
            © {new Date().getFullYear()} Tanmay Sahay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
