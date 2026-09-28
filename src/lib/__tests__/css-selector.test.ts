import { afterAll, describe, expect, it, vi } from 'vitest';
import { buildCssSelector } from '../css-selector';

// `CSS.escape` has no real browser behind it in the 'node' test environment
// (same reasoning as XPathResult in page-extractor.test.ts).
vi.stubGlobal('CSS', { escape: (value: string) => value });
afterAll(() => vi.unstubAllGlobals());

// ─── Fake DOM ────────────────────────────────────────────────────────────────
// buildCssSelector only ever touches tagName/id/parentElement/children (a real
// linked tree, since the algorithm walks it) and doc.querySelectorAll (a
// string-keyed map, like page-extractor.test.ts) — no real DOM implementation
// needed.

interface FakeElementInit {
  tagName: string;
  id?: string;
  parent?: Element;
}

function fakeElement({ tagName, id = '', parent }: FakeElementInit): Element {
  const el = {
    tagName: tagName.toUpperCase(),
    id,
    parentElement: parent ?? null,
    children: [] as Element[],
  };
  if (parent) {
    (parent as unknown as { children: Element[] }).children.push(el as unknown as Element);
  }
  return el as unknown as Element;
}

function fakeDoc(querySelectorAllMap: Record<string, Element[]>): Document {
  return {
    querySelectorAll: (selector: string) => querySelectorAllMap[selector] ?? [],
  } as unknown as Document;
}

describe('buildCssSelector', () => {
  it('uses #id when it uniquely identifies the element', () => {
    const el = fakeElement({ tagName: 'span', id: 'author' });
    const doc = fakeDoc({ '#author': [el] });

    expect(buildCssSelector(el, doc)).toBe('#author');
  });

  it('falls back to a tag chain when the id is not unique (duplicate ids, invalid HTML)', () => {
    const el = fakeElement({ tagName: 'span', id: 'dup' });
    const doc = fakeDoc({ '#dup': [el, fakeElement({ tagName: 'span', id: 'dup' })], span: [el, el] });

    expect(buildCssSelector(el, doc)).toBe('span');
  });

  it('walks up ancestors, adding :nth-of-type, until the selector becomes unique', () => {
    const section = fakeElement({ tagName: 'section' });
    fakeElement({ tagName: 'div', parent: section }); // div:nth-of-type(1), unrelated sibling
    const target = fakeElement({ tagName: 'div', parent: section }); // div:nth-of-type(2)

    const doc = fakeDoc({
      'div:nth-of-type(2)': [target, fakeElement({ tagName: 'div', id: 'other' })], // not unique on its own
      'section > div:nth-of-type(2)': [target], // unique once scoped to the parent
    });

    expect(buildCssSelector(target, doc)).toBe('section > div:nth-of-type(2)');
  });

  it('omits :nth-of-type when the element is the only one of its tag among its siblings', () => {
    const parent = fakeElement({ tagName: 'article' });
    const target = fakeElement({ tagName: 'h1', parent });
    fakeElement({ tagName: 'p', parent }); // different tag, doesn't count as a same-tag sibling

    const doc = fakeDoc({ h1: [target] });

    expect(buildCssSelector(target, doc)).toBe('h1');
  });

  it('stops at the depth limit (4 segments) without ever finding a unique selector', () => {
    let el = fakeElement({ tagName: 'div' });
    for (let i = 0; i < 5; i++) {
      el = fakeElement({ tagName: 'div', parent: el });
    }
    const doc = fakeDoc({}); // every probed selector "matches" 0 elements — never unique

    expect(buildCssSelector(el, doc)).toBe('div > div > div > div');
  });
});
