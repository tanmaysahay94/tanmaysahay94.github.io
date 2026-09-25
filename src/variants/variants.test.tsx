import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);
import Ledger from './Ledger';
import Paper from './Paper';
import Terminal from './Terminal';
import { RESUME_DATA } from '../InteractiveResume';

const noop = () => {};

describe.each([
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
    const { container } = render(<Component variant="paper" vtClass="vt-paper" onSwitch={noop} />);
    for (const job of RESUME_DATA.experience.filter((e) => e.type !== 'education')) {
      expect(container.textContent).toContain(job.impact_points[0]);
    }
  });
});
