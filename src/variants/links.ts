// Evidence links per experience entry — only real, public URLs.
// (Khoj and the network/Zurich roles are Google-internal: nothing to link.)
export const ROLE_LINKS: Record<string, { label: string; url: string }[]> = {
  'google-gemini': [
    { label: 'vertex ai', url: 'https://cloud.google.com/vertex-ai' },
    { label: 'gemini', url: 'https://gemini.google.com' },
  ],
  'google-serverless': [
    { label: 'cloud run', url: 'https://cloud.google.com/run' },
    { label: 'cloud functions', url: 'https://cloud.google.com/functions' },
  ],
  booking: [{ label: 'booking.com', url: 'https://www.booking.com' }],
  education: [{ label: 'iiit.ac.in', url: 'https://www.iiit.ac.in' }],
};

export const PROFILE_LINKS = {
  github: 'https://github.com/tanmaysahay94',
  linkedin: 'https://www.linkedin.com/in/tanmaysahay',
  // Sanitized build of ~/Sandbox/resume/TanmaySahayResume_FrontierLab.tex (phone stripped).
  resume: '/resume.pdf',
};
