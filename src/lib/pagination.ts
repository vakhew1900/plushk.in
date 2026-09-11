/** One entry of a page-number strip: a page index (0-based), or `null` for a truncation gap ("…"). */
export type PageItem = number | null;

const SIBLING_COUNT = 1;

export const PAGE_SIZE = 20;

export interface PageSlice<T> {
  /** Total number of pages for the given item count (at least 1, even for an empty list). */
  pageCount: number;
  /** Requested page, clamped into `[0, pageCount - 1]` (e.g. after the list shrank). */
  currentPage: number;
  /** The `PAGE_SIZE`-sized slice of `items` for `currentPage`. */
  pageItems: T[];
}

/** Slices `items` into `PAGE_SIZE`-sized pages, clamping a stale/out-of-range `page`. */
export function paginate<T>(items: readonly T[], page: number): PageSlice<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = items.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);
  return { pageCount, currentPage, pageItems };
}

/**
 * Builds the page-number strip for a 0-based `page` out of `pageCount` total pages,
 * always keeping the first and last page visible plus `SIBLING_COUNT` pages around
 * the current one, collapsing any larger gap into a single `null` entry.
 */
export function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 0) return [];

  const first = 0;
  const last = pageCount - 1;

  if (last === first) return [first];

  let start = Math.max(first + 1, page - SIBLING_COUNT);
  let end = Math.min(last - 1, page + SIBLING_COUNT);

  // A single hidden page between the boundary and the sibling window costs as
  // much horizontal space as the digit it would hide — show it directly
  // instead of collapsing it into an ellipsis.
  if (start === first + 2) start = first + 1;
  if (end === last - 2) end = last - 1;

  const items: PageItem[] = [first];
  if (start > first + 1) items.push(null);
  for (let i = start; i <= end; i++) items.push(i);
  if (end < last - 1) items.push(null);

  items.push(last);
  return items;
}
