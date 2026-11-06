import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HeartTerritoryView from './HeartTerritoryView';
import { MI_TERRITORIES } from '../data/miTerritories';

describe('heart territory orientation', () => {
  it('resets to anterior when an externally selected territory is no longer posterior', async () => {
    const onSelectTerritory = vi.fn();
    const { rerender } = render(
      <HeartTerritoryView selectedTerritoryId="posterior" onSelectTerritory={onSelectTerritory} />
    );

    const anteriorButton = screen.getByRole('button', { name: 'Anterior Heart View (Sternocostal)' });
    const posteriorButton = screen.getByRole('button', { name: 'Posterior / Inferior Heart View' });
    await waitFor(() => expect(posteriorButton).toHaveAttribute('aria-pressed', 'true'));

    rerender(
      <HeartTerritoryView selectedTerritoryId="anterior" onSelectTerritory={onSelectTerritory} />
    );
    await waitFor(() => expect(anteriorButton).toHaveAttribute('aria-pressed', 'true'));
    expect(posteriorButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('highlights the posterior LV free-wall region as part of Posterior STEMI', () => {
    render(<HeartTerritoryView selectedTerritoryId="posterior" onSelectTerritory={vi.fn()} />);

    expect(document.querySelector('#region-posterior')).toHaveAttribute('fill', '#f97316');
    expect(document.querySelector('#region-lv-post')).toHaveAttribute('fill', '#f97316');
    expect(document.querySelector('#region-inferior-post')).toHaveAttribute('fill', '#312e81');
    expect(document.querySelector('#region-rv-post')).toHaveAttribute('fill', '#641e2e');
  });

  it('highlights the right ventricular territory, not the inferior wall, in posterior view', () => {
    render(<HeartTerritoryView selectedTerritoryId="right_ventricular" onSelectTerritory={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Posterior / Inferior Heart View' }));

    expect(document.querySelector('#region-rv-post')).toHaveAttribute('fill', '#ef4444');
    expect(document.querySelector('#region-inferior-post')).toHaveAttribute('fill', '#312e81');
  });

  it('positions the inferior wall labels below the top border of the highlighted region', () => {
    render(<HeartTerritoryView selectedTerritoryId="inferior" onSelectTerritory={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Posterior / Inferior Heart View' }));

    expect(screen.getByText('Inferior Wall')).toHaveAttribute('y', '358');
    expect(screen.getByText('(II, III, aVF)')).toHaveAttribute('y', '370');
  });

  it('defaults Inferior STEMI to the posterior/diaphragmatic view', async () => {
    render(<HeartTerritoryView selectedTerritoryId="inferior" onSelectTerritory={vi.fn()} />);

    const posteriorButton = screen.getByRole('button', { name: 'Posterior / Inferior Heart View' });
    await waitFor(() => expect(posteriorButton).toHaveAttribute('aria-pressed', 'true'));
    expect(document.querySelector('#region-inferior-post')).toHaveAttribute('fill', '#10b981');
  });

  it('highlights the posterolateral LV wall for lateral STEMI in posterior view', () => {
    render(<HeartTerritoryView selectedTerritoryId="lateral" onSelectTerritory={vi.fn()} />);
    expect(document.querySelector('#artery-lad-diagonal')).toHaveAttribute('stroke', '#fef08a');
    expect(document.querySelector('#artery-lcx-om')).toHaveAttribute('stroke', '#fef08a');
    fireEvent.click(screen.getByRole('button', { name: 'Posterior / Inferior Heart View' }));

    expect(document.querySelector('#region-lv-post')).toHaveAttribute('fill', '#f97316');
    expect(document.querySelector('#artery-lcx-post')).toHaveAttribute('stroke', '#fbbf24');
    expect(document.querySelector('#artery-rca-plb')).toHaveAttribute('stroke', '#fbbf24');
  });

  it('highlights both D1 and OM1 branches for high lateral STEMI', () => {
    render(<HeartTerritoryView selectedTerritoryId="high_lateral" onSelectTerritory={vi.fn()} />);

    expect(document.querySelector('#region-high-lateral')).toHaveAttribute('fill', '#38bdf8');
    expect(document.querySelector('#artery-lad-diagonal')).toHaveAttribute('stroke', '#fef08a');
    expect(document.querySelector('#artery-lcx-om')).toHaveAttribute('stroke', '#fef08a');
  });

  it('does not identify the PDA as the defining culprit branch for inferobasal/posterior STEMI', () => {
    render(<HeartTerritoryView selectedTerritoryId="posterior" onSelectTerritory={vi.fn()} />);

    expect(document.querySelector('#artery-lcx-post')).toHaveAttribute('stroke', '#fbbf24');
    expect(document.querySelector('#artery-rca-plb')).toHaveAttribute('stroke', '#fbbf24');
    expect(document.querySelector('#artery-rca')).toHaveAttribute('stroke', '#ef4444');
    expect(document.querySelector('#artery-rca-pda')).toHaveAttribute('stroke', '#ef4444');
  });

  it('references only SVG regions and vessels that exist in the corresponding view', () => {
    for (const [territoryId, territory] of Object.entries(MI_TERRITORIES)) {
      const { unmount } = render(
        <HeartTerritoryView selectedTerritoryId={territoryId} onSelectTerritory={vi.fn()} />
      );

      const anteriorIds = territory.heartRegionCoords.anteriorHighlightSvgId ?? [];
      if (anteriorIds.length > 0) {
        fireEvent.click(screen.getByRole('button', { name: 'Anterior Heart View (Sternocostal)' }));
        anteriorIds.forEach(id => expect(document.getElementById(id)).not.toBeNull());
      }

      const posteriorIds = territory.heartRegionCoords.posteriorHighlightSvgId ?? [];
      if (posteriorIds.length > 0) {
        fireEvent.click(screen.getByRole('button', { name: 'Posterior / Inferior Heart View' }));
        posteriorIds.forEach(id => expect(document.getElementById(id)).not.toBeNull());
      }

      unmount();
    }
  });

  it('updates the selected territory through the native selector buttons', () => {
    const onSelectTerritory = vi.fn();
    render(<HeartTerritoryView selectedTerritoryId="normal" onSelectTerritory={onSelectTerritory} />);
    fireEvent.click(screen.getByRole('button', { name: 'Inferior' }));
    expect(onSelectTerritory).toHaveBeenCalledWith('inferior');
  });
});
