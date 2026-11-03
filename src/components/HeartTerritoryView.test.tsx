import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HeartTerritoryView from './HeartTerritoryView';

describe('heart territory orientation', () => {
  it('resets to anterior when an externally selected territory is no longer posterior', async () => {
    const onSelectTerritory = vi.fn();
    const { rerender } = render(
      <HeartTerritoryView selectedTerritoryId="posterior" onSelectTerritory={onSelectTerritory} />
    );

    const anteriorButton = screen.getByRole('button', { name: 'Anterior Heart View (Sternocostal)' });
    const posteriorButton = screen.getByRole('button', { name: 'Posterior / Inferior View (Diaphragmatic)' });
    await waitFor(() => expect(posteriorButton).toHaveAttribute('aria-pressed', 'true'));

    rerender(
      <HeartTerritoryView selectedTerritoryId="inferior" onSelectTerritory={onSelectTerritory} />
    );
    await waitFor(() => expect(anteriorButton).toHaveAttribute('aria-pressed', 'true'));
    expect(posteriorButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('updates the selected territory through the native selector buttons', () => {
    const onSelectTerritory = vi.fn();
    render(<HeartTerritoryView selectedTerritoryId="normal" onSelectTerritory={onSelectTerritory} />);
    fireEvent.click(screen.getByRole('button', { name: 'Inferior' }));
    expect(onSelectTerritory).toHaveBeenCalledWith('inferior');
  });
});
