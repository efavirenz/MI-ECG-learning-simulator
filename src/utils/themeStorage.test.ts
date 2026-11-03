import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_THEME_ID, THEMES } from '../data/themes';
import { loadStoredThemeId, saveStoredThemeId } from './themeStorage';

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { values.set(key, value); })
  };
}

describe('theme storage resilience', () => {
  let storage: ReturnType<typeof createStorage>;

  beforeEach(() => {
    storage = createStorage();
    vi.stubGlobal('window', { localStorage: storage } as unknown as Window);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads a valid saved theme', () => {
    const expectedTheme = THEMES[1].id;
    storage.getItem.mockReturnValue(expectedTheme);
    expect(loadStoredThemeId()).toBe(expectedTheme);
  });

  it('falls back for missing or invalid theme IDs', () => {
    expect(loadStoredThemeId()).toBe(DEFAULT_THEME_ID);
    storage.getItem.mockReturnValue('unknown-theme');
    expect(loadStoredThemeId()).toBe(DEFAULT_THEME_ID);
  });

  it('falls back when storage reads throw', () => {
    storage.getItem.mockImplementation(() => {
      throw new Error('Storage access denied');
    });
    expect(loadStoredThemeId()).toBe(DEFAULT_THEME_ID);
  });

  it('persists valid themes but safely ignores write failures and invalid IDs', () => {
    saveStoredThemeId(THEMES[2].id);
    expect(storage.setItem).toHaveBeenCalledWith('ecg-simulator-theme', THEMES[2].id);

    storage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    expect(() => saveStoredThemeId(THEMES[3].id)).not.toThrow();
    expect(storage.setItem).toHaveBeenCalledTimes(2);
    storage.setItem.mockClear();
    saveStoredThemeId('unknown-theme');
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});
