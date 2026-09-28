import { finder } from '@medv/finder';

export function buildCssSelector(element: Element, doc: Document = element.ownerDocument): string {
    return finder(element, { root: doc.body });
}


