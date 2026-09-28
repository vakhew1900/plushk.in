import { describe, expect, it } from 'vitest';
import { dictionaries, Locale } from '../../locale';
import { resolveQuickAddMenuTitles } from '../quick-add-menu-titles';

describe('resolveQuickAddMenuTitles', () => {
  it('resolves the Russian titles for Locale.RU', () => {
    expect(resolveQuickAddMenuTitles(Locale.RU)).toEqual({
      variable: dictionaries.ru.quickAdd.contextMenuVariable,
      icon: dictionaries.ru.quickAdd.contextMenuIcon,
    });
  });

  it('resolves the English titles for Locale.EN, not the Russian ones', () => {
    const titles = resolveQuickAddMenuTitles(Locale.EN);

    expect(titles).toEqual({
      variable: dictionaries.en.quickAdd.contextMenuVariable,
      icon: dictionaries.en.quickAdd.contextMenuIcon,
    });
    expect(titles.variable).not.toBe(dictionaries.ru.quickAdd.contextMenuVariable);
  });
});
