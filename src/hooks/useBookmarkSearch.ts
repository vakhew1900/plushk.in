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
  const [resolvedFiltersKey, setResolvedFiltersKey] = useState<string | null>(null);

  const filtersKey = JSON.stringify({ query, tagIds, entityTypeId, statusId });

  useEffect(() => {
    let cancelled = false;

    void bookmarkSearchService.search(query, { tagIds, entityTypeId, statusId }).then((entries) => {
      if (cancelled) return;
      setResults(entries);
      if (!query.trim()) setTotalCount(entries.length);
      setResolvedFiltersKey(filtersKey);
    });

    return () => {
      cancelled = true;
    };
  }, [bookmarkSearchService, query, tagIds, entityTypeId, statusId, filtersKey]);

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
    loading: resolvedFiltersKey !== filtersKey,
  };
}
