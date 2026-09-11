import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { browser } from 'wxt/browser';
import { ServicesContext } from '@/context/ServicesContext';
import { resolveLocaleFromUiLanguage } from '@/lib/resolve-locale-from-ui-language';
import { dictionaries } from '@/locale';
import type { Dictionary, Locale } from '@/locale';

export interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export function LocaleProvider({ children }: Props) {
  // Reads ServicesContext directly (not the useServices hook) to stay a
  // context-layer-only dependency per CLAUDE.md's layer order. Falls back to
  // in-memory-only state if rendered outside a ServicesProvider.
  const services = useContext(ServicesContext);
  // Synchronous default (no flash of the wrong locale before the storage read
  // below resolves): the system UI language, not a hardcoded RU (SETTINGS-2).
  const [locale, setLocaleState] = useState<Locale>(() => resolveLocaleFromUiLanguage(browser.i18n.getUILanguage()));

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
