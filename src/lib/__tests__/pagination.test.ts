import { describe, expect, it } from 'vitest';
import { getPageItems } from '../pagination';

describe('getPageItems', () => {
  it('returns an empty strip for zero pages', () => {
    expect(getPageItems(0, 0)).toEqual([]);
  });

  it('returns a single entry for one page', () => {
    expect(getPageItems(0, 1)).toEqual([0]);
  });

  it('shows every page when there is no gap to collapse', () => {
    expect(getPageItems(0, 2)).toEqual([0, 1]);
    expect(getPageItems(3, 7)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('collapses a trailing gap when the current page is near the start', () => {
    expect(getPageItems(1, 10)).toEqual([0, 1, 2, null, 9]);
  });

  it('collapses a leading gap when the current page is near the end', () => {
    expect(getPageItems(8, 10)).toEqual([0, null, 7, 8, 9]);
  });

  it('collapses both gaps when the current page is in the middle', () => {
    expect(getPageItems(5, 10)).toEqual([0, null, 4, 5, 6, null, 9]);
  });
});
