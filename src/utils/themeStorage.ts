import { DEFAULT_THEME_ID, THEMES } from '../data/themes';

const THEME_STORAGE_KEY = 'ecg-simulator-theme';

/** Read a persisted theme without allowing unavailable storage to block app startup. */
export function loadStoredThemeId(): string {
  try {
    const storedThemeId = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedThemeId && THEMES.some(theme => theme.id === storedThemeId)
      ? storedThemeId
      : DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

/** Persist theme changes best-effort; the in-memory selection remains authoritative. */
export function saveStoredThemeId(themeId: string): void {
  if (!THEMES.some(theme => theme.id === themeId)) return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch {
    // Storage can be disabled or unavailable; keep the active theme in memory.
  }
}
