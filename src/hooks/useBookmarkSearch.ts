import { useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { BookmarkSearchEntry } from '@/types/bookmark-search-entry';

export function useBookmarkSearch() {
  const { bookmarkSearchService } = useServices();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookmarkSearchEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void bookmarkSearchService.search(query).then((entries) => {
      if (cancelled) return;
      setResults(entries);
      if (!query.trim()) setTotalCount(entries.length);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [bookmarkSearchService, query]);

  return { query, setQuery, results, totalCount, loading };
}
