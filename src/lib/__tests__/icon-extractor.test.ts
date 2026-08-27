import { afterAll, describe, expect, it, vi } from 'vitest';
import { IconSourceType, type CssIconSource, type XPathIconSource } from '../../types/icon-rule';
import { applyIconSelector } from '../icon-extractor';

// `document.evaluate` (XPath) has no real browser behind it in the 'node' test
// environment, so `XPathResult.FIRST_ORDERED_NODE_TYPE` must be stubbed for that
// branch to run — see page-extractor.test.ts for the same need with STRING_TYPE.
vi.stubGlobal('XPathResult', { FIRST_ORDERED_NODE_TYPE: 9 });
afterAll(() => vi.unstubAllGlobals());

// ─── Fake DOM ────────────────────────────────────────────────────────────────
// Mirrors page-extractor.test.ts's fake DOM: icon-extractor.ts only ever touches
// querySelector/evaluate/getAttribute/baseURI, so a duck-typed Element/Document
// is enough — no need for a real DOM implementation. "First match wins" for
// multiple candidate elements is native querySelector/FIRST_ORDERED_NODE_TYPE
// behavior, not this module's own logic, so it isn't (and can't usefully be)
// exercised through this fake.

interface FakeElementInit {
  attributes?: Record<string, string>;
}

function fakeElement({ attributes = {} }: FakeElementInit = {}): Element {
  return {
    getAttribute: (name: string) => attributes[name] ?? null,
  } as unknown as Element;
}

interface FakeDocInit {
  baseURI?: string;
  querySelectorMap?: Record<string, Element | null>;
  xpathNodes?: Record<string, Element | null>;
}

function fakeDoc({
  baseURI = 'https://example.com/article',
  querySelectorMap = {},
  xpathNodes = {},
}: FakeDocInit = {}): Document {
  return {
    baseURI,
    querySelector: (selector: string) => querySelectorMap[selector] ?? null,
    evaluate: (expression: string) => ({ singleNodeValue: xpathNodes[expression] ?? null }),
  } as unknown as Document;
}

function css(value: string): CssIconSource {
  return { type: IconSourceType.CSS, value };
}

function xpath(value: string): XPathIconSource {
  return { type: IconSourceType.XPATH, value };
}

describe('applyIconSelector', () => {
  describe('css', () => {
    it('reads src from a matched <img>', () => {
      const doc = fakeDoc({
        querySelectorMap: { '.logo img': fakeElement({ attributes: { src: 'https://cdn.example.com/logo.png' } }) },
      });
      expect(applyIconSelector(css('.logo img'), doc)).toBe('https://cdn.example.com/logo.png');
    });

    it('falls back to href when src is absent (e.g. a <link> element)', () => {
      const doc = fakeDoc({
        querySelectorMap: { 'link[rel="icon"]': fakeElement({ attributes: { href: 'https://cdn.example.com/favicon.ico' } }) },
      });
      expect(applyIconSelector(css('link[rel="icon"]'), doc)).toBe('https://cdn.example.com/favicon.ico');
    });

    it('resolves a relative src against document.baseURI', () => {
      const doc = fakeDoc({
        baseURI: 'https://habr.com/ru/posts/123/',
        querySelectorMap: { '.logo img': fakeElement({ attributes: { src: '/logo.png' } }) },
      });
      expect(applyIconSelector(css('.logo img'), doc)).toBe('https://habr.com/logo.png');
    });

    it('returns undefined when nothing matches', () => {
      expect(applyIconSelector(css('.missing'), fakeDoc())).toBeUndefined();
    });

    it('returns undefined when the matched element has neither src nor href', () => {
      const doc = fakeDoc({
        querySelectorMap: { '.logo': fakeElement({ attributes: {} }) },
      });
      expect(applyIconSelector(css('.logo'), doc)).toBeUndefined();
    });
  });

  describe('xpath', () => {
    it('reads src off the first ordered node', () => {
      const doc = fakeDoc({
        xpathNodes: { '//img[@class="logo"]': fakeElement({ attributes: { src: 'https://cdn.example.com/logo.png' } }) },
      });
      expect(applyIconSelector(xpath('//img[@class="logo"]'), doc)).toBe('https://cdn.example.com/logo.png');
    });

    it('resolves a relative href against document.baseURI', () => {
      const doc = fakeDoc({
        baseURI: 'https://habr.com/ru/posts/123/',
        xpathNodes: { '//link': fakeElement({ attributes: { href: 'favicon.ico' } }) },
      });
      expect(applyIconSelector(xpath('//link'), doc)).toBe('https://habr.com/ru/posts/123/favicon.ico');
    });

    it('returns undefined when the expression matches no node', () => {
      expect(applyIconSelector(xpath('//missing'), fakeDoc())).toBeUndefined();
    });
  });
});
