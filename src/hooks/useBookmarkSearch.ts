import { useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { BookmarkSearchEntry } from '@/types/bookmark-search-entry';

export function useBookmarkSearch() {
  const { bookmarkSearchService } = useServices();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookmarkSearchEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [resolvedQuery, setResolvedQuery] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void bookmarkSearchService.search(query).then((entries) => {
      if (cancelled) return;
      setResults(entries);
      if (!query.trim()) setTotalCount(entries.length);
      setResolvedQuery(query);
    });

    return () => {
      cancelled = true;
    };
  }, [bookmarkSearchService, query]);

  return { query, setQuery, results, totalCount, loading: resolvedQuery !== query };
}
