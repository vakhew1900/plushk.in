import { createContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Locale, dictionaries } from '@/locale';
import type { Dictionary } from '@/locale';

export interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

interface Props {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LocaleProvider({ children, initialLocale = Locale.RU }: Props) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dict: dictionaries[locale], setLocale }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
