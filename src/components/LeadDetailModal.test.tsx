import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
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
    expect(screen.getByLabelText('Measured ST deviation')).toHaveTextContent('+1.0 mm (0.10 mV)');
  });
});
