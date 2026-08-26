import { useEffect, useState } from 'react';
import { useServices } from '@/hooks/useServices';

/**
 * Direct read/write access to a saved bookmark's manual icon override
 * (`IconBookmark.iconUrl`) — see UI-15. Immediate-write, same pattern as
 * `useBookmarkEntityLink`/`useBookmarkTagEditor`: an empty value clears the
 * override (removes the row) instead of persisting an empty string.
 */
export function useIconBookmarkOverride(bookmarkId: string) {
  const { iconBookmarkRepository } = useServices();
  const [iconUrl, setIconUrlState] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void iconBookmarkRepository.getById(bookmarkId).then((row) => {
      if (!cancelled) setIconUrlState(row?.iconUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [bookmarkId, iconBookmarkRepository]);

  const setIconUrl = async (value: string | undefined) => {
    const trimmed = value?.trim() || undefined;
    setIconUrlState(trimmed);
    if (trimmed) {
      await iconBookmarkRepository.save({ bookmarkId, iconUrl: trimmed });
    } else {
      await iconBookmarkRepository.remove(bookmarkId);
    }
  };

  return { iconUrl, setIconUrl };
}
