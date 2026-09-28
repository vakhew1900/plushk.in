import { describe, expect, it, vi } from 'vitest';
import { finder } from '@medv/finder';
import { buildCssSelector } from '../css-selector';

vi.mock('@medv/finder', () => ({ finder: vi.fn() }));

describe('buildCssSelector', () => {
  it('delegates to @medv/finder, scoped to the document body', () => {
    const element = {} as Element;
    const doc = { body: {} as Element } as Document;
    vi.mocked(finder).mockReturnValue('.article .author');

    expect(buildCssSelector(element, doc)).toBe('.article .author');
    expect(finder).toHaveBeenCalledWith(element, { root: doc.body });
  });
});
