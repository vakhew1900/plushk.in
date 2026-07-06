import { describe, expect, it } from 'vitest';
import { PageSelectorType } from '../../types/page-match';
import type { PageMatchGroup } from '../../types/page-match';
import { fromPageMatchGroup, toPageMatchGroup } from '../page-match-mapping';
import type { VariableGroupDraft } from '../page-match-mapping';

describe('toPageMatchGroup / fromPageMatchGroup', () => {
  it('round-trips a group with multiple fields, preserving order', () => {
    const draft: VariableGroupDraft = {
      id: 'g1',
      name: 'reddit',
      fields: [
        { k: 'title', v: 'body h1.post-title', selectorType: PageSelectorType.CSS },
        { k: 'author', v: 'author', selectorType: PageSelectorType.META },
        { k: 'published', v: '//time/@datetime', selectorType: PageSelectorType.XPATH },
      ],
    };

    const group = toPageMatchGroup(draft);
    expect(group.id).toBe('g1');
    expect(group.alias_name).toBe('reddit');
    expect(fromPageMatchGroup(group)).toEqual(draft);
  });

  it('produces a Map keyed by field name', () => {
    const draft: VariableGroupDraft = {
      id: 'g1',
      name: 'habr',
      fields: [{ k: 'title', v: 'h1.tm-title', selectorType: PageSelectorType.CSS }],
    };

    const group = toPageMatchGroup(draft);
    expect(group.pageMatches.get('title')).toEqual({
      name: 'title',
      selector: { type: PageSelectorType.CSS, value: 'h1.tm-title' },
    });
  });

  it('keeps two unnamed fields independent instead of collapsing them', () => {
    const draft: VariableGroupDraft = {
      id: 'g1',
      name: 'draft',
      fields: [
        { k: '', v: 'first', selectorType: PageSelectorType.CSS },
        { k: '', v: 'second', selectorType: PageSelectorType.CSS },
      ],
    };

    const group = toPageMatchGroup(draft);
    expect(group.pageMatches.size).toBe(2);
    expect(fromPageMatchGroup(group).fields.map((f) => f.v)).toEqual(['first', 'second']);
  });

  it('collapses two fields that share the same real name (known limitation)', () => {
    const draft: VariableGroupDraft = {
      id: 'g1',
      name: 'draft',
      fields: [
        { k: 'title', v: 'first', selectorType: PageSelectorType.CSS },
        { k: 'title', v: 'second', selectorType: PageSelectorType.CSS },
      ],
    };

    const group = toPageMatchGroup(draft);
    expect(group.pageMatches.size).toBe(1);
    expect(group.pageMatches.get('title')?.selector.value).toBe('second');
  });

  it('returns an empty fields array for a group with no page matches', () => {
    const group: PageMatchGroup = { id: 'g1', alias_name: 'empty', pageMatches: new Map() };
    expect(fromPageMatchGroup(group)).toEqual({ id: 'g1', name: 'empty', fields: [] });
  });
});
