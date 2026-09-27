import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);
import Ledger from './Ledger';
import Paper from './Paper';
import Terminal from './Terminal';
import Heritage from './Heritage';
import { RESUME_DATA } from '../InteractiveResume';

const noop = () => {};

describe.each([
  ['Heritage', Heritage],
  ['Ledger', Ledger],
  ['Paper', Paper],
  ['Terminal', Terminal],
] as const)('%s variant', (_name, Component) => {
  it('renders identity, evidence, and the variant switcher', () => {
    render(<Component variant="paper" vtClass="vt-paper" onSwitch={noop} />);
    expect(screen.getAllByText(/Tanmay Sahay/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/43/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'terminal' })).toBeTruthy();
  });

  it('shows a key bullet for every role, not only the current one', () => {
    if (Component === Heritage) return; // Heritage shows roles as a timeline; see below
    const { container } = render(<Component variant="paper" vtClass="vt-paper" onSwitch={noop} />);
    for (const job of RESUME_DATA.experience.filter((e) => e.type !== 'education')) {
      expect(container.textContent).toContain(job.impact_points[0]);
    }
  });
});

describe('Heritage (default view)', () => {
  it('puts every job on the timeline with its dates, and every highlight on the page', () => {
    const { container } = render(<Heritage variant="heritage" vtClass="vt-heritage" onSwitch={noop} />);
    const text = container.textContent ?? '';
    for (const [id, from] of [
      ['google-gemini', 'Apr 2025'],
      ['google-network', 'Feb 2024'],
      ['google-switzerland', 'Feb 2023'],
      ['google-serverless', 'Mar 2019'],
      ['booking', 'Jun 2017'],
    ]) {
      expect(RESUME_DATA.experience.some((e) => e.id === id)).toBe(true);
      expect(text).toContain(from);
    }
    for (const h of RESUME_DATA.highlights) expect(text).toContain(h.title);
    expect(text).toContain('Apr 2025 – present');
  });

  it('never puts the email address or phone number in the markup', () => {
    const { container } = render(<Heritage variant="heritage" vtClass="vt-heritage" onSwitch={noop} />);
    expect(container.innerHTML).not.toContain(RESUME_DATA.profile.contact.email);
    expect(container.innerHTML).not.toContain('650');
  });
});
