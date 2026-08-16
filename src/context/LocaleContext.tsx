import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ServicesContext } from '@/context/ServicesContext';
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
  // Reads ServicesContext directly (not the useServices hook) to stay a
  // context-layer-only dependency per CLAUDE.md's layer order. Falls back to
  // in-memory-only state if rendered outside a ServicesProvider.
  const services = useContext(ServicesContext);
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    if (!services) return;
    let cancelled = false;
    void services.localeSettingsRepository.get().then((value) => {
      if (!cancelled) setLocaleState(value);
    });
    return () => {
      cancelled = true;
    };
  }, [services]);

  const setLocale = useCallback(
    (value: Locale) => {
      setLocaleState(value);
      void services?.localeSettingsRepository.set(value);
    },
    [services],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dict: dictionaries[locale], setLocale }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
