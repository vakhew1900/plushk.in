import { describe, expect, it } from 'vitest';
import { Locale } from '../../locale';
import { resolveLocaleFromUiLanguage } from '../resolve-locale-from-ui-language';

describe('resolveLocaleFromUiLanguage', () => {
  it.each([
    ['ru', Locale.RU],
    ['ru-RU', Locale.RU],
    ['RU-ru', Locale.RU],
    ['en', Locale.EN],
    ['en-US', Locale.EN],
    ['de', Locale.EN],
    ['fr-FR', Locale.EN],
    ['es-ES', Locale.EN],
    ['', Locale.EN],
  ])('maps %s to %s', (uiLanguage, expected) => {
    expect(resolveLocaleFromUiLanguage(uiLanguage)).toBe(expected);
  });
});
