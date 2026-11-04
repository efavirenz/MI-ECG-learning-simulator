import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ECGWaveformMonitor from './ECGWaveformMonitor';

describe('ECG waveform animation lifecycle', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('disables trace playback when reduced motion is preferred', () => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    render(<ECGWaveformMonitor selectedTerritoryId="normal" paperMode="dark" onTogglePaperMode={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Play Trace' })).toBeDisabled();
  });

  it('stops requesting frames after the final paused redraw', () => {
    const pending = new Map<number, FrameRequestCallback>();
    let nextId = 1;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      const id = nextId++; pending.set(id, callback); return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => pending.delete(id));
    const context = new Proxy({} as CanvasRenderingContext2D, {
      get: (target, property) => { const value = Reflect.get(target, property); return typeof value === 'function' ? value.bind(target) : value ?? (() => undefined); },
      set: (target, property, value) => Reflect.set(target, property, value)
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => context);
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 300, height: 192, top: 0, left: 0, right: 300, bottom: 192, x: 0, y: 0, toJSON: () => ({}) });

    const { unmount } = render(<ECGWaveformMonitor selectedTerritoryId="normal" paperMode="dark" onTogglePaperMode={vi.fn()} />);
    expect(pending.size).toBe(1);
    const first = pending.entries().next().value;
    if (!first) throw new Error('Initial animation frame was not scheduled');
    pending.delete(first[0]);
    act(() => first[1](16));
    expect(pending.size).toBe(1);

    fireEvent.click(screen.getByRole('button', { name: /Pause/ }));
    expect(pending.size).toBe(1);
    const finalFrame = pending.entries().next().value;
    if (!finalFrame) throw new Error('Paused redraw was not scheduled');
    pending.delete(finalFrame[0]);
    act(() => finalFrame[1](32));
    expect(pending.size).toBe(0);
    unmount();
  });
});
