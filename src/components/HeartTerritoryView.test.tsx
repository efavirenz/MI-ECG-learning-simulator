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
    const posteriorButton = screen.getByRole('button', { name: 'Posterior Heart View' });
    await waitFor(() => expect(posteriorButton).toHaveAttribute('aria-pressed', 'true'));

    rerender(
      <HeartTerritoryView selectedTerritoryId="inferior" onSelectTerritory={onSelectTerritory} />
    );
    await waitFor(() => expect(anteriorButton).toHaveAttribute('aria-pressed', 'true'));
    expect(posteriorButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('highlights the right ventricular territory, not the inferior wall, in posterior view', () => {
    render(<HeartTerritoryView selectedTerritoryId="right_ventricular" onSelectTerritory={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Posterior Heart View' }));

    expect(document.querySelector('#region-rv-post')).toHaveAttribute('fill', '#ef4444');
    expect(document.querySelector('#region-inferior-post')).toHaveAttribute('fill', '#312e81');
  });

  it('positions the inferior wall labels below the top border of the highlighted region', () => {
    render(<HeartTerritoryView selectedTerritoryId="inferior" onSelectTerritory={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Posterior Heart View' }));

    expect(screen.getByText('Inferior Wall')).toHaveAttribute('y', '358');
    expect(screen.getByText('(II, III, aVF)')).toHaveAttribute('y', '370');
  });

  it('updates the selected territory through the native selector buttons', () => {
    const onSelectTerritory = vi.fn();
    render(<HeartTerritoryView selectedTerritoryId="normal" onSelectTerritory={onSelectTerritory} />);
    fireEvent.click(screen.getByRole('button', { name: 'Inferior' }));
    expect(onSelectTerritory).toHaveBeenCalledWith('inferior');
  });
});
