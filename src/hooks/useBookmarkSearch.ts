import { useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { paginate } from '@/lib/pagination';
import type { BookmarkSearchEntry } from '@/types/bookmark-search-entry';

const QUERY_DEBOUNCE_MS = 200;

export function useBookmarkSearch() {
  const { bookmarkSearchService } = useServices();
  const [query, setQuery] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [entityTypeId, setEntityTypeIdState] = useState<string | undefined>(undefined);
  const [statusId, setStatusId] = useState<string | undefined>(undefined);
  const [folderPath, setFolderPath] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<BookmarkSearchEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);

  // Bumped after a mutation outside the filter/query inputs below (delete,
  // move via UI-16) to force the search effect to re-run — those don't
  // change any of the effect's other dependencies on their own.
  const [refreshToken, setRefreshToken] = useState(0);
  const refresh = () => setRefreshToken((token) => token + 1);

  // The input itself stays instant (bound directly to `query`) — only the
  // actual re-scan (`IBookmarkRepository.listAll()` + filtering) and the
  // resulting re-render lag behind by a beat, so fast typing doesn't
  // re-search and reflow the results list on every single keystroke.
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), QUERY_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    void bookmarkSearchService.search(debouncedQuery, { tagIds, entityTypeId, statusId, folderPath }).then((entries) => {
      if (cancelled) return;
      setResults(entries);
      if (!debouncedQuery.trim()) setTotalCount(entries.length);
    });

    return () => {
      cancelled = true;
    };
  }, [bookmarkSearchService, debouncedQuery, tagIds, entityTypeId, statusId, folderPath, refreshToken]);

  // A genuinely new search (query/filters) always starts back at page 1 — a
  // stale page number from the previous result set wouldn't line up with the
  // new one. Adjusted during render (React's documented pattern for resetting
  // state on a prop/input change) instead of an effect, so the reset lands in
  // the same render pass as the input change rather than triggering an extra
  // one. A plain refresh (delete/move via UI-16) does NOT reset the page —
  // `pageCount` below clamps the one case that needs adjusting there (the
  // page's last item was just removed).
  const filterKey = `${debouncedQuery}${tagIds.join(',')}${entityTypeId ?? ''}${statusId ?? ''}${folderPath ?? ''}`;
  const [pageResetKey, setPageResetKey] = useState(filterKey);
  if (filterKey !== pageResetKey) {
    setPageResetKey(filterKey);
    setPage(0);
  }

  const { pageCount, currentPage, pageItems: pagedResults } = paginate(results, page);

  const toggleTagId = (tagId: string) => {
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  // Changing the category always resets the status filter — a status belongs
  // to one category's workflow, so a stale selection from the previous
  // category would silently exclude everything once the category changes.
  const setEntityTypeId = (id: string | undefined) => {
    setEntityTypeIdState(id);
    setStatusId(undefined);
  };

  const resetFilters = () => {
    setTagIds([]);
    setEntityTypeIdState(undefined);
    setStatusId(undefined);
    setFolderPath(undefined);
  };

  return {
    query,
    setQuery,
    tagIds,
    toggleTagId,
    entityTypeId,
    setEntityTypeId,
    statusId,
    setStatusId,
    folderPath,
    setFolderPath,
    resetFilters,
    results,
    pagedResults,
    totalCount,
    refresh,
    page: currentPage,
    setPage,
    pageCount,
  };
}
