import { Locale } from '../locale';

/**
 * Maps a BCP-47 UI language tag (e.g. from `browser.i18n.getUILanguage()` or
 * `navigator.language`) to one of the app's supported locales. Only `ru`/`en`
 * exist today (`src/locale`), so anything not starting with `ru` falls back
 * to `en` — English, not `ru`, is the universal default for unrecognized
 * languages (SETTINGS-2).
 */
export function resolveLocaleFromUiLanguage(uiLanguage: string): Locale {
  return uiLanguage.toLowerCase().startsWith(Locale.RU) ? Locale.RU : Locale.EN;
}
