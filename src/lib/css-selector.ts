// Builds a CSS selector for an arbitrary element the user right-clicked
// (RULE-14 quick-add flow). Deliberately simple: `#id` when unique, else an
// ancestor chain of `tag:nth-of-type(n)` segments joined by `>`, walking up
// until the selector becomes unique or a depth limit is hit. Classes are
// never used (CSS-modules hashes/utility classes are unstable across builds/
// pages). Real uniqueness narrowing beyond this (picking a better scoping
// ancestor, etc.) is deferred — see RULE-14's "Сузить selector…" placeholder.
const MAX_DEPTH = 4;

function isUnique(selector: string, doc: Document): boolean {
  return doc.querySelectorAll(selector).length === 1;
}

function nthOfTypeSegment(element: Element): string {
  const tag = element.tagName.toLowerCase();
  const parent = element.parentElement;
  if (!parent) return tag;

  const sameTagSiblings = Array.from(parent.children).filter((c) => c.tagName === element.tagName);
  if (sameTagSiblings.length <= 1) return tag;

  const index = sameTagSiblings.indexOf(element) + 1;
  return `${tag}:nth-of-type(${index})`;
}

export function buildCssSelector(element: Element, doc: Document = element.ownerDocument): string {
  if (element.id) {
    const idSelector = `#${CSS.escape(element.id)}`;
    if (isUnique(idSelector, doc)) return idSelector;
  }

  const segments: string[] = [];
  let current: Element | null = element;

  for (let depth = 0; depth < MAX_DEPTH && current; depth++) {
    segments.unshift(nthOfTypeSegment(current));
    const selector = segments.join(' > ');
    if (isUnique(selector, doc)) return selector;
    current = current.parentElement;
  }

  return segments.join(' > ');
}
