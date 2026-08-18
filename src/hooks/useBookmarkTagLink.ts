import { useCallback, useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';

export function useBookmarkTagLink(bookmarkId: string) {
  const { bookmarkTagLinkRepository } = useServices();
  const [tagIds, setTagIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void bookmarkTagLinkRepository.getById(bookmarkId).then((link) => {
      if (!cancelled) setTagIds(link?.tagIds ?? []);
    });
    return () => {
      cancelled = true;
    };
  }, [bookmarkId, bookmarkTagLinkRepository]);

  const toggleTag = useCallback(
    async (tagId: string) => {
      const next = tagIds.includes(tagId) ? tagIds.filter((id) => id !== tagId) : [...tagIds, tagId];
      setTagIds(next);
      await bookmarkTagLinkRepository.save({ bookmarkId, tagIds: next });
    },
    [bookmarkId, tagIds, bookmarkTagLinkRepository],
  );

  return { tagIds, toggleTag };
}
