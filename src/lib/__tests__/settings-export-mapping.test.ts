import { describe, expect, it } from 'vitest';
import { PageSelectorType } from '../../types/page-match';
import type { PageMatchGroup } from '../../types/page-match';
import { SETTINGS_EXPORT_VERSION } from '../../types/settings-export';
import type { SettingsExport } from '../../types/settings-export';
import { fromExportPageMatchGroup, isSettingsExport, toExportPageMatchGroup } from '../settings-export-mapping';

describe('toExportPageMatchGroup / fromExportPageMatchGroup', () => {
  it('round-trips a group through the JSON-safe Record form', () => {
    const group: PageMatchGroup = {
      id: 'g1',
      aliasId: 'alias-habr',
      pageMatches: new Map([
        ['title', { name: 'title', selector: { type: PageSelectorType.CSS, value: 'h1.tm-title' } }],
      ]),
    };

    const exported = toExportPageMatchGroup(group);
    expect(exported).toEqual({
      id: 'g1',
      aliasId: 'alias-habr',
      pageMatches: { title: { name: 'title', selector: { type: PageSelectorType.CSS, value: 'h1.tm-title' } } },
    });
    expect(fromExportPageMatchGroup(exported)).toEqual(group);
  });
});

describe('isSettingsExport', () => {
  const valid: SettingsExport = {
    version: SETTINGS_EXPORT_VERSION,
    exportedAt: '2026-07-24T00:00:00.000Z',
    rules: [],
    domainAliases: [],
    pageMatchGroups: [],
  };

  it('accepts a well-formed export payload', () => {
    expect(isSettingsExport(valid)).toBe(true);
  });

  it('rejects a mismatched version', () => {
    expect(isSettingsExport({ ...valid, version: 999 })).toBe(false);
  });

  it.each(['rules', 'domainAliases', 'pageMatchGroups'] as const)('rejects a non-array %s field', (field) => {
    expect(isSettingsExport({ ...valid, [field]: 'not-an-array' })).toBe(false);
  });

  it('rejects null and non-object values', () => {
    expect(isSettingsExport(null)).toBe(false);
    expect(isSettingsExport('a string')).toBe(false);
    expect(isSettingsExport(42)).toBe(false);
  });
});
