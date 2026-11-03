import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PosteriorTorso from './PosteriorTorso';

describe('posterior torso electrode controls', () => {
  it('supports keyboard activation of SVG electrode markers', () => {
    const onSelectElectrode = vi.fn();
    render(<PosteriorTorso selectedElectrodeId={null} onSelectElectrode={onSelectElectrode} />);
    const marker = screen.getByRole('button', { name: /Select .*V7/ });
    fireEvent.keyDown(marker, { key: 'Enter' });
    expect(onSelectElectrode).toHaveBeenCalledWith(expect.objectContaining({ code: 'V7' }));
  });
});
