import { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';
import type { BookmarkEntityLink } from '@/types/bookmark-entity-link';

export function useBookmarkEntityLink(bookmarkId: string) {
  const { bookmarkEntityLinkRepository } = useServices();
  const [link, setLink] = useState<BookmarkEntityLink | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void bookmarkEntityLinkRepository.getById(bookmarkId).then((l) => {
      if (!cancelled) setLink(l);
    });
    return () => {
      cancelled = true;
    };
  }, [bookmarkId, bookmarkEntityLinkRepository]);

  const setEntity = useCallback(
    async (entityTypeId: string | undefined, statusId?: string) => {
      if (!entityTypeId) {
        setLink(undefined);
        await bookmarkEntityLinkRepository.remove(bookmarkId);
        return;
      }
      const next: BookmarkEntityLink = { bookmarkId, entityTypeId, statusId };
      setLink(next);
      await bookmarkEntityLinkRepository.save(next);
    },
    [bookmarkId, bookmarkEntityLinkRepository],
  );

  const setStatus = useCallback(
    async (statusId: string) => {
      if (!link) return;
      const next = { ...link, statusId };
      setLink(next);
      await bookmarkEntityLinkRepository.save(next);
    },
    [link, bookmarkEntityLinkRepository],
  );

  return { link, setEntity, setStatus };
}
