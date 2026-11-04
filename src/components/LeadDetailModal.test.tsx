import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import LeadDetailModal from './LeadDetailModal';

function ModalHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open lead analysis</button>
      {open && (
        <LeadDetailModal
          lead="II"
          territoryId="normal"
          paperMode="dark"
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

describe('lead detail dialog accessibility', () => {
  it('moves focus into the dialog and restores it after Escape', () => {
    render(<ModalHarness />);
    const trigger = screen.getByRole('button', { name: 'Open lead analysis' });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Lead II Magnified Waveform Analysis' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close lead detail dialog' })).toHaveFocus();
    expect(screen.getByText(/Isolated-lead measurement only — this view cannot diagnose or exclude STEMI/)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('supports keyboard caliper adjustment in 1 mm increments', () => {
    render(
      <LeadDetailModal lead="II" territoryId="normal" paperMode="dark" onClose={() => undefined} />
    );
    const waveform = screen.getByRole('group', { name: /Magnified isolated-lead ECG waveform/ });
    waveform.focus();
    fireEvent.keyDown(waveform, { key: 'ArrowUp' });
    expect(screen.getByLabelText('Measured voltage relative to model reference')).toHaveTextContent('+1.0 mm (0.10 mV)');
  });

  it('respects the reduced-motion preference by disabling the live waveform sweep', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    render(
      <LeadDetailModal lead="II" territoryId="normal" paperMode="dark" onClose={() => undefined} />
    );
    expect(screen.getByRole('button', { name: 'Live Sweep' })).toBeDisabled();
    vi.unstubAllGlobals();
  });

  it('disables caliper feedback for pericarditis until a validated reference method is approved', () => {
    render(
      <LeadDetailModal lead="II" territoryId="pericarditis" paperMode="dark" onClose={() => undefined} />
    );
    const waveform = screen.getByRole('group', { name: /Magnified isolated-lead ECG waveform/ });
    waveform.focus();
    fireEvent.keyDown(waveform, { key: 'ArrowUp' });
    expect(screen.getByText(/Measurement feedback is disabled for this territory/)).toBeInTheDocument();
    expect(screen.queryByText(/Active Voltage Measurement/)).not.toBeInTheDocument();
    expect(screen.getByText(/TP reference \(0.00 mV\)/)).toBeInTheDocument();
  });
});
