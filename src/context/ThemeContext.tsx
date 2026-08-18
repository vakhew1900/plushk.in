import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ServicesContext } from '@/context/ServicesContext';
import { Theme } from '@/types/theme';

type ResolvedTheme = typeof Theme.DARK | typeof Theme.LIGHT;

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return Theme.DARK;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
}

interface Props {
  children: ReactNode;
  initialTheme?: Theme;
}

export function ThemeProvider({ children, initialTheme = Theme.DARK }: Props) {
  // Reads ServicesContext directly (not the useServices hook) to stay a
  // context-layer-only dependency per CLAUDE.md's layer order. Falls back to
  // in-memory-only state if rendered outside a ServicesProvider.
  const services = useContext(ServicesContext);
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => setSystemTheme(media.matches ? Theme.DARK : Theme.LIGHT);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (!services) return;
    let cancelled = false;
    void services.themeSettingsRepository.get().then((value) => {
      if (!cancelled) setThemeState(value);
    });
    return () => {
      cancelled = true;
    };
  }, [services]);

  const resolvedTheme = theme === Theme.SYSTEM ? systemTheme : theme;

  // Radix portals (Select/DropdownMenu/Popover) render into document.body,
  // outside the app root div that normally carries data-theme — without this
  // they'd always inherit the :root/html fallback (dark) regardless of the
  // chosen theme. Mirroring the attribute onto <html> keeps everything,
  // portalled or not, in the same theme scope.
  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (value: Theme) => {
      setThemeState(value);
      void services?.themeSettingsRepository.set(value);
    },
    [services],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
