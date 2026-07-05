import { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export const Theme = { DARK: 'dark', LIGHT: 'light', SYSTEM: 'system' } as const;
export type Theme = typeof Theme[keyof typeof Theme];

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
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => setSystemTheme(media.matches ? Theme.DARK : Theme.LIGHT);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const resolvedTheme = theme === Theme.SYSTEM ? systemTheme : theme;

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
