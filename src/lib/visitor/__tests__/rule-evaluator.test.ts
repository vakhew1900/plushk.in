import { describe, expect, it } from 'vitest';
import type { PageMeta } from '../../../types/page-meta';
import type { BookmarkRule } from '../../../types/rule';
import { RuleType } from '../../../types/rule';
import { countLeafRules, evaluate, findMatchingRule, parseRuleNode } from '../rule-evaluator';

const meta: PageMeta = {
  url: 'https://youtube.com/watch?v=abc123',
  domain: 'youtube.com',
  title: 'React Tutorial for Beginners',
  description: 'Learn React from scratch',
  author: 'John Doe',
  tags: ['tutorial', 'react', 'javascript'],
};

// ─── Simple rules ────────────────────────────────────────────────────────────

describe('term', () => {
  it('matches exact string field', () => {
    expect(evaluate({ type: RuleType.TERM, field: 'domain', value: 'youtube.com' }, meta)).toBe(true);
  });

  it('does not match wrong value', () => {
    expect(evaluate({ type: RuleType.TERM, field: 'domain', value: 'github.com' }, meta)).toBe(false);
  });

  it('matches value inside array field', () => {
    expect(evaluate({ type: RuleType.TERM, field: 'tags', value: 'react' }, meta)).toBe(true);
  });

  it('returns false for missing optional field', () => {
    expect(evaluate({ type: RuleType.TERM, field: 'language', value: 'en' }, meta)).toBe(false);
  });
});

describe('terms', () => {
  it('matches when string field is one of the values', () => {
    expect(evaluate({ type: RuleType.TERMS, field: 'domain', values: ['youtube.com', 'vimeo.com'] }, meta)).toBe(true);
  });

  it('does not match when string field is not in values', () => {
    expect(evaluate({ type: RuleType.TERMS, field: 'domain', values: ['github.com', 'vimeo.com'] }, meta)).toBe(false);
  });

  it('matches when array field intersects with values', () => {
    expect(evaluate({ type: RuleType.TERMS, field: 'tags', values: ['tutorial', 'video'] }, meta)).toBe(true);
  });

  it('does not match when array field has no intersection', () => {
    expect(evaluate({ type: RuleType.TERMS, field: 'tags', values: ['python', 'video'] }, meta)).toBe(false);
  });
});

describe('regex', () => {
  it('matches url with pattern', () => {
    expect(evaluate({ type: RuleType.REGEX, field: 'url', pattern: '.*watch.*' }, meta)).toBe(true);
  });

  it('does not match url with non-matching pattern', () => {
    expect(evaluate({ type: RuleType.REGEX, field: 'url', pattern: '.*github.*' }, meta)).toBe(false);
  });

  it('matches title with partial pattern', () => {
    expect(evaluate({ type: RuleType.REGEX, field: 'title', pattern: '.*Tutorial.*' }, meta)).toBe(true);
  });
});

describe('wildcard', () => {
  it('matches domain with * wildcard', () => {
    expect(evaluate({ type: RuleType.WILDCARD, field: 'domain', pattern: '*.com' }, meta)).toBe(true);
  });

  it('does not match wrong tld', () => {
    expect(evaluate({ type: RuleType.WILDCARD, field: 'domain', pattern: '*.edu' }, meta)).toBe(false);
  });

  it('matches title with surrounding wildcards', () => {
    expect(evaluate({ type: RuleType.WILDCARD, field: 'title', pattern: '*Tutorial*' }, meta)).toBe(true);
  });
});

describe('and', () => {
  it('returns true when all sub-rules match', () => {
    expect(evaluate({
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.TERM, field: 'author', value: 'John Doe' },
      ],
    }, meta)).toBe(true);
  });

  it('returns false when one sub-rule fails', () => {
    expect(evaluate({
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.TERM, field: 'author', value: 'Jane Doe' },
      ],
    }, meta)).toBe(false);
  });
});

describe('or', () => {
  it('returns true when at least one sub-rule matches', () => {
    expect(evaluate({
      type: RuleType.OR,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'github.com' },
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
      ],
    }, meta)).toBe(true);
  });

  it('returns false when no sub-rule matches', () => {
    expect(evaluate({
      type: RuleType.OR,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'github.com' },
        { type: RuleType.TERM, field: 'domain', value: 'vimeo.com' },
      ],
    }, meta)).toBe(false);
  });
});

describe('not', () => {
  it('returns true when all sub-rules do not match', () => {
    expect(evaluate({
      type: RuleType.NOT,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'github.com' },
      ],
    }, meta)).toBe(true);
  });

  it('returns false when a sub-rule matches', () => {
    expect(evaluate({
      type: RuleType.NOT,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
      ],
    }, meta)).toBe(false);
  });
});

// ─── Combinations ────────────────────────────────────────────────────────────

describe('AND + OR', () => {
  it('matches when domain fits AND at least one tag matches', () => {
    expect(evaluate({
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        {
          type: RuleType.OR,
          nodes: [
            { type: RuleType.TERM, field: 'tags', value: 'tutorial' },
            { type: RuleType.TERM, field: 'tags', value: 'video' },
          ],
        },
      ],
    }, meta)).toBe(true);
  });

  it('fails when OR sub-rules all fail', () => {
    expect(evaluate({
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        {
          type: RuleType.OR,
          nodes: [
            { type: RuleType.TERM, field: 'tags', value: 'python' },
            { type: RuleType.TERM, field: 'tags', value: 'video' },
          ],
        },
      ],
    }, meta)).toBe(false);
  });
});

describe('AND + NOT', () => {
  it('matches when domain fits AND author is not excluded', () => {
    expect(evaluate({
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.NOT, nodes: [{ type: RuleType.TERM, field: 'author', value: 'Jane Doe' }] },
      ],
    }, meta)).toBe(true);
  });

  it('fails when NOT sub-rule matches', () => {
    expect(evaluate({
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.NOT, nodes: [{ type: RuleType.TERM, field: 'author', value: 'John Doe' }] },
      ],
    }, meta)).toBe(false);
  });
});

describe('OR + NOT', () => {
  it('returns true via NOT branch when domain does not match forbidden value', () => {
    expect(evaluate({
      type: RuleType.OR,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'github.com' },
        { type: RuleType.NOT, nodes: [{ type: RuleType.TERM, field: 'domain', value: 'github.com' }] },
      ],
    }, meta)).toBe(true);
  });
});

// ─── Complex ─────────────────────────────────────────────────────────────────

describe('complex: AND containing NOT and OR', () => {
  it('matches a video tutorial that is not for advanced users', () => {
    expect(evaluate({
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        {
          type: RuleType.OR,
          nodes: [
            { type: RuleType.TERM, field: 'tags', value: 'tutorial' },
            { type: RuleType.TERM, field: 'tags', value: 'course' },
          ],
        },
        {
          type: RuleType.NOT,
          nodes: [{ type: RuleType.WILDCARD, field: 'title', pattern: '*Advanced*' }],
        },
      ],
    }, meta)).toBe(true);
  });

  it('fails when title contains Advanced', () => {
    const advancedMeta: PageMeta = { ...meta, title: 'Advanced React Patterns' };
    expect(evaluate({
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        {
          type: RuleType.OR,
          nodes: [
            { type: RuleType.TERM, field: 'tags', value: 'tutorial' },
          ],
        },
        {
          type: RuleType.NOT,
          nodes: [{ type: RuleType.WILDCARD, field: 'title', pattern: '*Advanced*' }],
        },
      ],
    }, advancedMeta)).toBe(false);
  });
});

describe('complex: deeply nested AND inside OR', () => {
  it('matches when second AND branch succeeds', () => {
    expect(evaluate({
      type: RuleType.OR,
      nodes: [
        {
          type: RuleType.AND,
          nodes: [
            { type: RuleType.TERM, field: 'domain', value: 'github.com' },
            { type: RuleType.TERM, field: 'tags', value: 'open-source' },
          ],
        },
        {
          type: RuleType.AND,
          nodes: [
            { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
            { type: RuleType.TERM, field: 'tags', value: 'react' },
          ],
        },
      ],
    }, meta)).toBe(true);
  });
});

// ─── countLeafRules ──────────────────────────────────────────────────────────

describe('countLeafRules', () => {
  it('returns 1 for a single leaf rule', () => {
    expect(countLeafRules({ type: RuleType.TERM, field: 'domain', value: 'youtube.com' })).toBe(1);
  });

  it('sums leaves across an AND group', () => {
    expect(countLeafRules({
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.TERM, field: 'author', value: 'John Doe' },
      ],
    })).toBe(2);
  });

  it('sums leaves across nested OR/AND/NOT groups', () => {
    expect(countLeafRules({
      type: RuleType.OR,
      nodes: [
        {
          type: RuleType.AND,
          nodes: [
            { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
            { type: RuleType.NOT, nodes: [{ type: RuleType.TERM, field: 'author', value: 'Jane Doe' }] },
          ],
        },
        { type: RuleType.WILDCARD, field: 'title', pattern: '*Tutorial*' },
      ],
    })).toBe(3);
  });

  it('returns 0 for an empty compound rule', () => {
    expect(countLeafRules({ type: RuleType.OR, nodes: [] })).toBe(0);
  });
});

// ─── parseRuleNode ───────────────────────────────────────────────────────────

describe('parseRuleNode', () => {
  it('parses a valid leaf rule', () => {
    const raw = JSON.stringify({ type: RuleType.TERM, field: 'domain', value: 'youtube.com' });
    expect(parseRuleNode(raw)).toEqual({ type: RuleType.TERM, field: 'domain', value: 'youtube.com' });
  });

  it('parses a valid nested compound rule', () => {
    const node = {
      type: RuleType.AND,
      nodes: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.TERMS, field: 'tags', values: ['tutorial', 'course'] },
      ],
    };
    expect(parseRuleNode(JSON.stringify(node))).toEqual(node);
  });

  it('returns null for syntactically invalid JSON', () => {
    expect(parseRuleNode('{ not valid json')).toBeNull();
  });

  it('returns null when the type discriminator is missing', () => {
    expect(parseRuleNode(JSON.stringify({ field: 'domain', value: 'youtube.com' }))).toBeNull();
  });

  it('returns null when the type is unrecognized', () => {
    expect(parseRuleNode(JSON.stringify({ type: 'contains', field: 'title', value: 'foo' }))).toBeNull();
  });

  it('returns null when a leaf rule is missing a required field', () => {
    expect(parseRuleNode(JSON.stringify({ type: RuleType.TERM, field: 'domain' }))).toBeNull();
  });

  it('returns null when a compound rule child is invalid', () => {
    const raw = JSON.stringify({
      type: RuleType.AND,
      nodes: [{ type: RuleType.TERM, field: 'domain', value: 'youtube.com' }, { type: 'bogus' }],
    });
    expect(parseRuleNode(raw)).toBeNull();
  });

  it('returns null for a plain array or primitive', () => {
    expect(parseRuleNode('[]')).toBeNull();
    expect(parseRuleNode('"just a string"')).toBeNull();
    expect(parseRuleNode('42')).toBeNull();
  });
});

// ─── findMatchingRule ────────────────────────────────────────────────────────

function makeRule(overrides: Partial<BookmarkRule> & Pick<BookmarkRule, 'id' | 'condition'>): BookmarkRule {
  return {
    name: overrides.id,
    targetFolder: 'Folder',
    priority: 0,
    enabled: true,
    ...overrides,
  };
}

describe('findMatchingRule', () => {
  it('returns the first enabled rule whose condition matches, in list order', () => {
    const rules: BookmarkRule[] = [
      makeRule({ id: 'a', targetFolder: 'A', condition: { type: RuleType.TERM, field: 'domain', value: 'github.com' } }),
      makeRule({ id: 'b', targetFolder: 'B', condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' } }),
      makeRule({ id: 'c', targetFolder: 'C', condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' } }),
    ];

    expect(findMatchingRule(rules, meta)?.id).toBe('b');
  });

  it('skips a disabled rule even if its condition matches', () => {
    const rules: BookmarkRule[] = [
      makeRule({
        id: 'disabled',
        enabled: false,
        targetFolder: 'Disabled',
        condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
      }),
      makeRule({
        id: 'enabled',
        targetFolder: 'Enabled',
        condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
      }),
    ];

    expect(findMatchingRule(rules, meta)?.id).toBe('enabled');
  });

  it('returns undefined when no rule matches', () => {
    const rules: BookmarkRule[] = [
      makeRule({ id: 'a', condition: { type: RuleType.TERM, field: 'domain', value: 'github.com' } }),
    ];

    expect(findMatchingRule(rules, meta)).toBeUndefined();
  });

  it('returns undefined for an empty rule list', () => {
    expect(findMatchingRule([], meta)).toBeUndefined();
  });

  // ─── RULE-10: hierarchical rules ─────────────────────────────────────────

  it('descends into a matching child, preferring it over its also-matching parent', () => {
    const rules: BookmarkRule[] = [
      makeRule({ id: 'youtube', targetFolder: 'Video', condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' } }),
      makeRule({
        id: 'tutorials',
        parentId: 'youtube',
        targetFolder: 'Video/Tutorials',
        condition: { type: RuleType.TERM, field: 'tags', value: 'tutorial' },
      }),
    ];

    expect(findMatchingRule(rules, meta)?.id).toBe('tutorials');
  });

  it('falls back to the parent when none of its children match', () => {
    const rules: BookmarkRule[] = [
      makeRule({ id: 'youtube', targetFolder: 'Video', condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' } }),
      makeRule({
        id: 'music',
        parentId: 'youtube',
        targetFolder: 'Video/Music',
        condition: { type: RuleType.TERM, field: 'tags', value: 'music' },
      }),
    ];

    expect(findMatchingRule(rules, meta)?.id).toBe('youtube');
  });

  it('never checks the children of a parent whose own condition does not match', () => {
    const rules: BookmarkRule[] = [
      makeRule({ id: 'github', condition: { type: RuleType.TERM, field: 'domain', value: 'github.com' } }),
      // Would match `meta` on its own, but its parent ("github") never matches.
      makeRule({ id: 'github-child', parentId: 'github', condition: { type: RuleType.TERM, field: 'tags', value: 'tutorial' } }),
    ];

    expect(findMatchingRule(rules, meta)).toBeUndefined();
  });

  it('picks the deepest match across a three-level chain', () => {
    const rules: BookmarkRule[] = [
      makeRule({ id: 'youtube', condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' } }),
      makeRule({ id: 'tutorials', parentId: 'youtube', condition: { type: RuleType.TERM, field: 'tags', value: 'tutorial' } }),
      makeRule({ id: 'react-tutorials', parentId: 'tutorials', condition: { type: RuleType.TERM, field: 'tags', value: 'react' } }),
    ];

    expect(findMatchingRule(rules, meta)?.id).toBe('react-tutorials');
  });

  it('resolves two matching siblings by (already-sorted) list order, not by depth', () => {
    // `findMatchingRule` trusts the caller's order — same contract as the
    // pre-RULE-10 flat behavior above — rather than re-sorting by priority
    // itself; `BookmarkRuleRepository.queryAll()` is what actually sorts
    // desc. Listed here in that same priority-desc order.
    const rules: BookmarkRule[] = [
      makeRule({ id: 'youtube', condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' } }),
      makeRule({
        id: 'high-priority-child',
        parentId: 'youtube',
        priority: 10,
        condition: { type: RuleType.TERM, field: 'tags', value: 'tutorial' },
      }),
      makeRule({
        id: 'low-priority-child',
        parentId: 'youtube',
        priority: 0,
        condition: { type: RuleType.TERM, field: 'tags', value: 'tutorial' },
      }),
    ];

    expect(findMatchingRule(rules, meta)?.id).toBe('high-priority-child');
  });

  it('skips a disabled parent along with its whole (otherwise-matching) subtree', () => {
    const rules: BookmarkRule[] = [
      makeRule({
        id: 'disabled-youtube',
        enabled: false,
        condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
      }),
      makeRule({ id: 'disabled-child', parentId: 'disabled-youtube', condition: { type: RuleType.TERM, field: 'tags', value: 'tutorial' } }),
      makeRule({ id: 'fallback', condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' } }),
    ];

    expect(findMatchingRule(rules, meta)?.id).toBe('fallback');
  });

  it('falls back to the enabled parent when its only matching child is disabled', () => {
    const rules: BookmarkRule[] = [
      makeRule({ id: 'youtube', condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' } }),
      makeRule({
        id: 'disabled-tutorials',
        parentId: 'youtube',
        enabled: false,
        condition: { type: RuleType.TERM, field: 'tags', value: 'tutorial' },
      }),
    ];

    expect(findMatchingRule(rules, meta)?.id).toBe('youtube');
  });
});
