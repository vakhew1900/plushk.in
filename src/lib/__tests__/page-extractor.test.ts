import { afterAll, describe, expect, it, vi } from 'vitest';
import type { PageMatch, PageMatchGroup, PageSelector } from '../../types/page-match';
import { PageSelectorType } from '../../types/page-match';
import { PageMetaField } from '../../types/page-meta';
import { applySelector, buildPartialMeta } from '../page-extractor';

// `document.evaluate` (XPath) has no real browser behind it in the 'node' test
// environment, so `XPathResult.STRING_TYPE` must be stubbed for that branch to run.
vi.stubGlobal('XPathResult', { STRING_TYPE: 2 });
afterAll(() => vi.unstubAllGlobals());

// ─── Fake DOM ────────────────────────────────────────────────────────────────
// page-extractor.ts only ever touches querySelector/evaluate/URL, so a tiny
// duck-typed Document is enough — no need for a real DOM implementation.

interface FakeElementInit {
  tagName: string;
  attributes?: Record<string, string>;
  textContent?: string | null;
}

function fakeElement({ tagName, attributes = {}, textContent = null }: FakeElementInit): Element {
  return {
    tagName: tagName.toUpperCase(),
    textContent,
    getAttribute: (name: string) => attributes[name] ?? null,
  } as unknown as Element;
}

interface FakeDocInit {
  url?: string;
  querySelectorMap?: Record<string, Element | null>;
  xpathResults?: Record<string, string>;
}

function fakeDoc({
  url = 'https://example.com/article',
  querySelectorMap = {},
  xpathResults = {},
}: FakeDocInit = {}): Document {
  return {
    URL: url,
    querySelector: (selector: string) => querySelectorMap[selector] ?? null,
    evaluate: (expression: string) => ({ stringValue: xpathResults[expression] ?? '' }),
  } as unknown as Document;
}

function group(pageMatches: [string, PageMatch][]): PageMatchGroup {
  return { id: 'g1', aliasId: 'test', pageMatches: new Map(pageMatches) };
}

function match(name: string, selector: PageSelector): PageMatch {
  return { name, selector };
}

// ─── applySelector ───────────────────────────────────────────────────────────

describe('applySelector', () => {
  describe('css selector', () => {
    it('returns trimmed textContent for a non-meta element', () => {
      const doc = fakeDoc({
        querySelectorMap: { 'h1.title': fakeElement({ tagName: 'h1', textContent: '  Hello World  ' }) },
      });
      const selector: PageSelector = { type: PageSelectorType.CSS, value: 'h1.title' };
      expect(applySelector(selector, doc)).toBe('Hello World');
    });

    it('reads the content attribute when the matched element is a <meta> tag', () => {
      const doc = fakeDoc({
        querySelectorMap: {
          'meta[name="description"]': fakeElement({ tagName: 'meta', attributes: { content: 'A great page' } }),
        },
      });
      const selector: PageSelector = { type: PageSelectorType.CSS, value: 'meta[name="description"]' };
      expect(applySelector(selector, doc)).toBe('A great page');
    });

    it('returns undefined when nothing matches', () => {
      const selector: PageSelector = { type: PageSelectorType.CSS, value: '.missing' };
      expect(applySelector(selector, fakeDoc())).toBeUndefined();
    });

    it('returns undefined for blank textContent', () => {
      const doc = fakeDoc({
        querySelectorMap: { '.empty': fakeElement({ tagName: 'span', textContent: '   ' }) },
      });
      const selector: PageSelector = { type: PageSelectorType.CSS, value: '.empty' };
      expect(applySelector(selector, doc)).toBeUndefined();
    });
  });

  describe('meta selector', () => {
    it('prefers meta[name] over meta[property]', () => {
      const doc = fakeDoc({
        querySelectorMap: {
          'meta[name="author"]': fakeElement({ tagName: 'meta', attributes: { content: 'By Name' } }),
          'meta[property="author"]': fakeElement({ tagName: 'meta', attributes: { content: 'By Property' } }),
        },
      });
      const selector: PageSelector = { type: PageSelectorType.META, value: 'author' };
      expect(applySelector(selector, doc)).toBe('By Name');
    });

    it('falls back to meta[property] when meta[name] is absent', () => {
      const doc = fakeDoc({
        querySelectorMap: {
          'meta[property="og:title"]': fakeElement({ tagName: 'meta', attributes: { content: 'OG Title' } }),
        },
      });
      const selector: PageSelector = { type: PageSelectorType.META, value: 'og:title' };
      expect(applySelector(selector, doc)).toBe('OG Title');
    });

    it('returns undefined when neither variant matches', () => {
      const selector: PageSelector = { type: PageSelectorType.META, value: 'missing' };
      expect(applySelector(selector, fakeDoc())).toBeUndefined();
    });
  });

  describe('xpath selector', () => {
    it('returns the evaluated string value', () => {
      const doc = fakeDoc({ xpathResults: { '//h1/text()': 'XPath Title' } });
      const selector: PageSelector = { type: PageSelectorType.XPATH, value: '//h1/text()' };
      expect(applySelector(selector, doc)).toBe('XPath Title');
    });

    it('returns undefined for an empty string value', () => {
      const doc = fakeDoc({ xpathResults: { '//missing': '' } });
      const selector: PageSelector = { type: PageSelectorType.XPATH, value: '//missing' };
      expect(applySelector(selector, doc)).toBeUndefined();
    });
  });
});

// ─── buildPartialMeta ────────────────────────────────────────────────────────

describe('buildPartialMeta', () => {
  it('always derives url and domain from doc.URL', () => {
    const doc = fakeDoc({ url: 'https://habr.com/ru/articles/123/' });
    const result = buildPartialMeta(group([]), doc);
    expect(result.url).toBe('https://habr.com/ru/articles/123/');
    expect(result.domain).toBe('habr.com');
  });

  it('maps an extractable field from a css selector', () => {
    const doc = fakeDoc({
      querySelectorMap: { 'h1.tm-title': fakeElement({ tagName: 'h1', textContent: 'Как я...' }) },
    });
    const result = buildPartialMeta(
      group([['title', match('title', { type: PageSelectorType.CSS, value: 'h1.tm-title' })]]),
      doc,
    );
    expect(result.title).toBe('Как я...');
  });

  it('maps author from a meta selector', () => {
    const doc = fakeDoc({
      querySelectorMap: {
        'meta[name="author"]': fakeElement({ tagName: 'meta', attributes: { content: 'John Doe' } }),
      },
    });
    const result = buildPartialMeta(
      group([['author', match('author', { type: PageSelectorType.META, value: 'author' })]]),
      doc,
    );
    expect(result.author).toBe('John Doe');
  });

  it('splits, trims, and filters a comma-separated tags field', () => {
    const doc = fakeDoc({
      querySelectorMap: {
        'meta[name="keywords"]': fakeElement({ tagName: 'meta', attributes: { content: 'react, , tutorial ,js' } }),
      },
    });
    const result = buildPartialMeta(
      group([[PageMetaField.TAGS, match(PageMetaField.TAGS, { type: PageSelectorType.META, value: 'keywords' })]]),
      doc,
    );
    expect(result.tags).toEqual(['react', 'tutorial', 'js']);
  });

  it('routes an unrecognized field name into extras', () => {
    const doc = fakeDoc({
      querySelectorMap: { '.readtime': fakeElement({ tagName: 'span', textContent: '5 min' }) },
    });
    const result = buildPartialMeta(
      group([['readTime', match('readTime', { type: PageSelectorType.CSS, value: '.readtime' })]]),
      doc,
    );
    expect(result.extras).toEqual({ readTime: '5 min' });
    expect(result).not.toHaveProperty('readTime');
  });

  it('omits the field entirely when its selector matches nothing', () => {
    const result = buildPartialMeta(
      group([['title', match('title', { type: PageSelectorType.CSS, value: '.missing' })]]),
      fakeDoc(),
    );
    expect(result.title).toBeUndefined();
  });

  it('leaves extras undefined when no custom fields were extracted', () => {
    const doc = fakeDoc({
      querySelectorMap: { h1: fakeElement({ tagName: 'h1', textContent: 'Title' }) },
    });
    const result = buildPartialMeta(
      group([['title', match('title', { type: PageSelectorType.CSS, value: 'h1' })]]),
      doc,
    );
    expect(result.extras).toBeUndefined();
  });

  it('combines extractable fields, tags, and extras in a single pass', () => {
    const doc = fakeDoc({
      url: 'https://reddit.com/r/webdev/comments/xyz',
      querySelectorMap: {
        'h1.post-title': fakeElement({ tagName: 'h1', textContent: 'Show your project' }),
        'a.author-name': fakeElement({ tagName: 'a', textContent: 'u/dev123' }),
        '.flair': fakeElement({ tagName: 'span', textContent: 'Showcase' }),
      },
    });
    const result = buildPartialMeta(
      group([
        ['title', match('title', { type: PageSelectorType.CSS, value: 'h1.post-title' })],
        ['author', match('author', { type: PageSelectorType.CSS, value: 'a.author-name' })],
        ['flair', match('flair', { type: PageSelectorType.CSS, value: '.flair' })],
      ]),
      doc,
    );

    expect(result).toEqual({
      url: 'https://reddit.com/r/webdev/comments/xyz',
      domain: 'reddit.com',
      title: 'Show your project',
      author: 'u/dev123',
      extras: { flair: 'Showcase' },
    });
  });
});
