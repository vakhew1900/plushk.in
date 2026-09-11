import { afterAll, describe, expect, it, vi } from 'vitest';
import type { PageMatch, PageMatchGroup, PageSelector } from '../../types/page-match';
import { PageSelectorType } from '../../types/page-match';
import { PageMetaField } from '../../types/page-meta';
import { applySelector, buildPartialMeta } from '../page-extractor';

// `document.evaluate` (XPath) has no real browser behind it in the 'node' test
// environment, so `XPathResult.ORDERED_NODE_SNAPSHOT_TYPE` must be stubbed for
// that branch to run.
vi.stubGlobal('XPathResult', { ORDERED_NODE_SNAPSHOT_TYPE: 7 });
afterAll(() => vi.unstubAllGlobals());

// ─── Fake DOM ────────────────────────────────────────────────────────────────
// page-extractor.ts only ever touches querySelector(All)/evaluate/URL, so a
// tiny duck-typed Document is enough — no need for a real DOM implementation.

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
  querySelectorAllMap?: Record<string, Element[]>;
  xpathSnapshotResults?: Record<string, string[]>;
}

function fakeDoc({
  url = 'https://example.com/article',
  querySelectorMap = {},
  querySelectorAllMap = {},
  xpathSnapshotResults = {},
}: FakeDocInit = {}): Document {
  return {
    URL: url,
    querySelector: (selector: string) => querySelectorMap[selector] ?? null,
    querySelectorAll: (selector: string) => querySelectorAllMap[selector] ?? [],
    evaluate: (expression: string) => {
      const items = xpathSnapshotResults[expression] ?? [];
      return {
        snapshotLength: items.length,
        snapshotItem: (i: number) => ({ textContent: items[i] }) as unknown as Node,
      };
    },
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
    it('returns trimmed textContent for every matched element', () => {
      const doc = fakeDoc({
        querySelectorAllMap: { 'a.hub': [fakeElement({ tagName: 'a', textContent: '  Java  ' })] },
      });
      const selector: PageSelector = { type: PageSelectorType.CSS, value: 'a.hub' };
      expect(applySelector(selector, doc)).toEqual(['Java']);
    });

    it('reads the content attribute for a matched <meta> tag', () => {
      const doc = fakeDoc({
        querySelectorAllMap: {
          'meta[name="description"]': [fakeElement({ tagName: 'meta', attributes: { content: 'A great page' } })],
        },
      });
      const selector: PageSelector = { type: PageSelectorType.CSS, value: 'meta[name="description"]' };
      expect(applySelector(selector, doc)).toEqual(['A great page']);
    });

    it('collects every matched element, in document order', () => {
      const doc = fakeDoc({
        querySelectorAllMap: {
          'a.hub': [
            fakeElement({ tagName: 'a', textContent: 'IT-компании' }),
            fakeElement({ tagName: 'a', textContent: 'Java' }),
            fakeElement({ tagName: 'a', textContent: 'Open source' }),
          ],
        },
      });
      const selector: PageSelector = { type: PageSelectorType.CSS, value: 'a.hub' };
      expect(applySelector(selector, doc)).toEqual(['IT-компании', 'Java', 'Open source']);
    });

    it('drops elements with blank textContent', () => {
      const doc = fakeDoc({
        querySelectorAllMap: {
          'a.hub': [fakeElement({ tagName: 'a', textContent: 'Java' }), fakeElement({ tagName: 'a', textContent: '   ' })],
        },
      });
      const selector: PageSelector = { type: PageSelectorType.CSS, value: 'a.hub' };
      expect(applySelector(selector, doc)).toEqual(['Java']);
    });

    it('returns undefined when nothing matches', () => {
      const selector: PageSelector = { type: PageSelectorType.CSS, value: '.missing' };
      expect(applySelector(selector, fakeDoc())).toBeUndefined();
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
    it('returns every snapshot node as an array', () => {
      const doc = fakeDoc({ xpathSnapshotResults: { '//a[@class="hub"]': ['IT-компании', 'Java'] } });
      const selector: PageSelector = { type: PageSelectorType.XPATH, value: '//a[@class="hub"]' };
      expect(applySelector(selector, doc)).toEqual(['IT-компании', 'Java']);
    });

    it('returns undefined when the snapshot is empty', () => {
      const doc = fakeDoc({ xpathSnapshotResults: { '//missing': [] } });
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

  it('maps an extractable field from a css selector, taking the first match', () => {
    const doc = fakeDoc({
      querySelectorAllMap: {
        'h1.tm-title': [
          fakeElement({ tagName: 'h1', textContent: 'Как я...' }),
          fakeElement({ tagName: 'h1', textContent: 'Second match' }),
        ],
      },
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

  it('splits, trims, and filters a comma-separated tags field from a meta selector', () => {
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

  it('uses each matched element as one tag directly (no comma-split) from a css selector', () => {
    const doc = fakeDoc({
      querySelectorAllMap: {
        'a.hub': [fakeElement({ tagName: 'a', textContent: 'Java' }), fakeElement({ tagName: 'a', textContent: 'Spring Boot' })],
      },
    });
    const result = buildPartialMeta(
      group([[PageMetaField.TAGS, match(PageMetaField.TAGS, { type: PageSelectorType.CSS, value: 'a.hub' })]]),
      doc,
    );
    expect(result.tags).toEqual(['Java', 'Spring Boot']);
  });

  it('routes every matched element into extras as a string[]', () => {
    const doc = fakeDoc({
      querySelectorAllMap: {
        'a.hub': [fakeElement({ tagName: 'a', textContent: 'IT-компании' }), fakeElement({ tagName: 'a', textContent: 'Java' })],
      },
    });
    const result = buildPartialMeta(
      group([['hub', match('hub', { type: PageSelectorType.CSS, value: 'a.hub' })]]),
      doc,
    );
    expect(result.extras).toEqual({ hub: ['IT-компании', 'Java'] });
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
      querySelectorAllMap: { h1: [fakeElement({ tagName: 'h1', textContent: 'Title' })] },
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
      querySelectorAllMap: {
        'h1.post-title': [fakeElement({ tagName: 'h1', textContent: 'Show your project' })],
        'a.author-name': [fakeElement({ tagName: 'a', textContent: 'u/dev123' })],
        '.flair': [fakeElement({ tagName: 'span', textContent: 'Showcase' })],
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
      extras: { flair: ['Showcase'] },
    });
  });
});
