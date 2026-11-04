import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AnteriorTorso from './AnteriorTorso';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('anterior torso practice mode', () => {
  it('cancels an old target timer when practice is exited and restarted', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.5).mockReturnValueOnce(0.8);
    render(<AnteriorTorso selectedElectrodeId={null} onSelectElectrode={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /Practice Mode/ }));
    const firstPrompt = screen.getByText(/Locate & Tap:/).textContent;
    const firstCode = firstPrompt?.match(/\(([^)]+)\)/)?.[1];
    expect(firstCode).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(firstCode ?? 'no-match') }));
    expect(screen.getByRole('status')).toHaveTextContent('Correct!');

    fireEvent.click(screen.getByRole('button', { name: /Exit/ }));
    fireEvent.click(screen.getByRole('button', { name: /Practice Mode/ }));
    const restartedPrompt = screen.getByText(/Locate & Tap:/).textContent;

    vi.advanceTimersByTime(1800);
    expect(screen.getByText(/Locate & Tap:/).textContent).toBe(restartedPrompt);
  });

  it('hides a previously selected electrode when entering practice mode', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { container } = render(
      <AnteriorTorso selectedElectrodeId="v6" onSelectElectrode={vi.fn()} />
    );

    expect(container.querySelector('circle[stroke-width="3.5"]')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Practice Mode/ }));

    expect(container.querySelector('circle[stroke-width="3.5"]')).toBeNull();
  });

  it('supports keyboard activation of SVG electrode markers', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<AnteriorTorso selectedElectrodeId={null} onSelectElectrode={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Practice Mode/ }));
    const marker = screen.getAllByRole('button', { name: /Practice target position/ })[0];
    fireEvent.keyDown(marker, { key: 'Enter' });
    expect(marker).toBeInTheDocument();
  });
});
