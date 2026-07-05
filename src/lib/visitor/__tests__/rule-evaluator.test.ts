import { describe, expect, it } from 'vitest';
import type { PageMeta } from '../../../types/page-meta';
import { RuleType } from '../../../types/rule';
import { evaluate } from '../rule-evaluator';

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
      and: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.TERM, field: 'author', value: 'John Doe' },
      ],
    }, meta)).toBe(true);
  });

  it('returns false when one sub-rule fails', () => {
    expect(evaluate({
      type: RuleType.AND,
      and: [
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
      or: [
        { type: RuleType.TERM, field: 'domain', value: 'github.com' },
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
      ],
    }, meta)).toBe(true);
  });

  it('returns false when no sub-rule matches', () => {
    expect(evaluate({
      type: RuleType.OR,
      or: [
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
      not: [
        { type: RuleType.TERM, field: 'domain', value: 'github.com' },
      ],
    }, meta)).toBe(true);
  });

  it('returns false when a sub-rule matches', () => {
    expect(evaluate({
      type: RuleType.NOT,
      not: [
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
      and: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        {
          type: RuleType.OR,
          or: [
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
      and: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        {
          type: RuleType.OR,
          or: [
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
      and: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.NOT, not: [{ type: RuleType.TERM, field: 'author', value: 'Jane Doe' }] },
      ],
    }, meta)).toBe(true);
  });

  it('fails when NOT sub-rule matches', () => {
    expect(evaluate({
      type: RuleType.AND,
      and: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        { type: RuleType.NOT, not: [{ type: RuleType.TERM, field: 'author', value: 'John Doe' }] },
      ],
    }, meta)).toBe(false);
  });
});

describe('OR + NOT', () => {
  it('returns true via NOT branch when domain does not match forbidden value', () => {
    expect(evaluate({
      type: RuleType.OR,
      or: [
        { type: RuleType.TERM, field: 'domain', value: 'github.com' },
        { type: RuleType.NOT, not: [{ type: RuleType.TERM, field: 'domain', value: 'github.com' }] },
      ],
    }, meta)).toBe(true);
  });
});

// ─── Complex ─────────────────────────────────────────────────────────────────

describe('complex: AND containing NOT and OR', () => {
  it('matches a video tutorial that is not for advanced users', () => {
    expect(evaluate({
      type: RuleType.AND,
      and: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        {
          type: RuleType.OR,
          or: [
            { type: RuleType.TERM, field: 'tags', value: 'tutorial' },
            { type: RuleType.TERM, field: 'tags', value: 'course' },
          ],
        },
        {
          type: RuleType.NOT,
          not: [{ type: RuleType.WILDCARD, field: 'title', pattern: '*Advanced*' }],
        },
      ],
    }, meta)).toBe(true);
  });

  it('fails when title contains Advanced', () => {
    const advancedMeta: PageMeta = { ...meta, title: 'Advanced React Patterns' };
    expect(evaluate({
      type: RuleType.AND,
      and: [
        { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
        {
          type: RuleType.OR,
          or: [
            { type: RuleType.TERM, field: 'tags', value: 'tutorial' },
          ],
        },
        {
          type: RuleType.NOT,
          not: [{ type: RuleType.WILDCARD, field: 'title', pattern: '*Advanced*' }],
        },
      ],
    }, advancedMeta)).toBe(false);
  });
});

describe('complex: deeply nested AND inside OR', () => {
  it('matches when second AND branch succeeds', () => {
    expect(evaluate({
      type: RuleType.OR,
      or: [
        {
          type: RuleType.AND,
          and: [
            { type: RuleType.TERM, field: 'domain', value: 'github.com' },
            { type: RuleType.TERM, field: 'tags', value: 'open-source' },
          ],
        },
        {
          type: RuleType.AND,
          and: [
            { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
            { type: RuleType.TERM, field: 'tags', value: 'react' },
          ],
        },
      ],
    }, meta)).toBe(true);
  });
});
