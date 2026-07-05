import { useContext } from 'react';
import { LocaleContext } from '@/context/LocaleContext';
import type { TranslationKey } from '@/locale';

function resolve(dict: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (typeof acc !== 'object' || acc === null) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, dict);
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useTranslation must be used within a LocaleProvider');

  const { dict, locale, setLocale } = ctx;

  function translate(key: TranslationKey, params?: Record<string, string | number>): string {
    const value = resolve(dict, key);
    if (typeof value !== 'string') return key;
    if (!params) return value;
    return Object.entries(params).reduce(
      (str, [name, replacement]) => str.replaceAll(`{{${name}}}`, String(replacement)),
      value,
    );
  }

  return { translate: translate, locale, setLocale };
}
