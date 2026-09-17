import { describe, expect, it } from 'vitest';
import type { PageMatch, PageMatchGroup } from '../../page-match';
import { PageSelectorType } from '../../page-match';
import { fromPageExtractGroup, toPageExtractGroup } from '../page-extract-message';

// Regression coverage for a real cross-browser bug: `PageMatchGroup.pageMatches`
// is a `Map`, but Chrome's extension messaging JSON-serializes `sendMessage`
// payloads (silently turning a `Map` into `{}`), while Firefox's structured
// clone preserves it — so a rule that worked in Firefox matched nothing at
// all in any Chromium browser. `toPageExtractGroup`/`fromPageExtractGroup`
// carry `pageMatches` as a plain `[string, PageMatch][]` across that boundary
// instead, which survives `JSON.stringify`/`JSON.parse` identically everywhere.
describe('page-extract-message Map <-> wire conversion', () => {
  it('round-trips pageMatches through a JSON boundary without losing entries', () => {
    const match: PageMatch = { name: 'hub', selector: { type: PageSelectorType.CSS, value: 'a.content-header__topic' } };
    const group: PageMatchGroup = { id: 'g1', aliasId: 'alias-1', pageMatches: new Map([['hub', match]]) };

    const wire = toPageExtractGroup(group);
    const throughJson = JSON.parse(JSON.stringify(wire)) as typeof wire;
    const restored = fromPageExtractGroup(throughJson);

    expect(restored.pageMatches).toBeInstanceOf(Map);
    expect(restored.pageMatches.get('hub')).toEqual(match);
  });

  it('drops the Map entirely if sent as-is through JSON (why the wire format is needed)', () => {
    const group: PageMatchGroup = {
      id: 'g1',
      aliasId: 'alias-1',
      pageMatches: new Map([['hub', { name: 'hub', selector: { type: PageSelectorType.CSS, value: 'a' } }]]),
    };

    const naiveJsonRoundTrip = JSON.parse(JSON.stringify(group)) as { pageMatches: unknown };

    expect(naiveJsonRoundTrip.pageMatches).toEqual({});
  });
});
