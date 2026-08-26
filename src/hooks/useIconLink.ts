import { useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';

interface Resolved {
  key: string;
  url: string | undefined;
}

/** Resolved icon for an already-saved bookmark — see RULE-13's `IIconLinkService.resolveForBookmark`. */
export function useIconLink(bookmarkId: string | undefined, url: string | undefined): string | undefined {
  const { iconLinkService } = useServices();
  const [resolved, setResolved] = useState<Resolved | undefined>(undefined);

  useEffect(() => {
    if (!bookmarkId || !url) return;

    let cancelled = false;
    const key = `${bookmarkId}|${url}`;
    void iconLinkService.resolveForBookmark(bookmarkId, url).then((result) => {
      if (!cancelled) setResolved({ key, url: result.url });
    });
    return () => {
      cancelled = true;
    };
  }, [bookmarkId, url, iconLinkService]);

  if (!bookmarkId || !url) return undefined;
  // Guards against showing a stale result from a previous (bookmarkId, url)
  // pair while the new one is still resolving.
  return resolved?.key === `${bookmarkId}|${url}` ? resolved.url : undefined;
}
