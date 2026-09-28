import { dictionaries, type Locale } from '../locale';

export interface QuickAddMenuTitles {
  variable: string;
  icon: string;
}

/** Resolves the two RULE-14 context-menu item titles for a given locale — background.ts has no React tree to run `useTranslation()`/`LocaleProvider` in, so this reads `dictionaries` (the same source those are built on) directly. */
export function resolveQuickAddMenuTitles(locale: Locale): QuickAddMenuTitles {
  const dict = dictionaries[locale].quickAdd;
  return { variable: dict.contextMenuVariable, icon: dict.contextMenuIcon };
}
