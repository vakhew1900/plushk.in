import { useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { BookmarkSearchEntry } from '@/types/bookmark-search-entry';

export function useBookmarkSearch() {
  const { bookmarkSearchService } = useServices();
  const [query, setQuery] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [entityTypeId, setEntityTypeIdState] = useState<string | undefined>(undefined);
  const [statusId, setStatusId] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<BookmarkSearchEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Reset `loading` during render (not in the effect below) when the search
  // params change, so the spinner shows up in the same render pass instead
  // of triggering an extra effect-driven commit (react-hooks/set-state-in-effect).
  const filtersKey = JSON.stringify({ query, tagIds, entityTypeId, statusId });
  const [prevFiltersKey, setPrevFiltersKey] = useState(filtersKey);
  if (filtersKey !== prevFiltersKey) {
    setPrevFiltersKey(filtersKey);
    setLoading(true);
  }

  useEffect(() => {
    let cancelled = false;

    void bookmarkSearchService.search(query, { tagIds, entityTypeId, statusId }).then((entries) => {
      if (cancelled) return;
      setResults(entries);
      if (!query.trim()) setTotalCount(entries.length);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [bookmarkSearchService, query, tagIds, entityTypeId, statusId]);

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
    resetFilters,
    results,
    totalCount,
    loading,
  };
}
