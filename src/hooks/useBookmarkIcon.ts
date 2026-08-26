import { useEffect, useState } from 'react';
import { resolveFaviconUrl } from '@/lib/browser-constants/faviconUrl';
import { useServices } from '@/hooks/useServices';

interface Resolved {
  key: string;
  displayUrl: string | undefined;
  overrideUrl: string | undefined;
}

/**
 * Single shared source of truth for a saved bookmark's icon — see RULE-13/UI-15.
 * `displayUrl` is what to render (manual override, or the `IconRule` value
 * cached at save time, or the plain favicon fallback); `overrideUrl` is the
 * raw manual-override value only, for the settings dialog's editable field.
 * `setOverride` writes it and updates both together.
 *
 * This replaces two previously-independent hooks (a read-only `useIconLink`
 * and a write-only `useIconBookmarkOverride`) that each held their own local
 * state — editing the icon in the settings dialog updated the write hook's
 * state but left every read hook instance (the card's own favicon, the
 * dialog's own preview) showing a stale value until an unrelated re-render
 * happened to land. Same root cause as ARCH-12: call this once per bookmark,
 * at the lowest common ancestor of every consumer, and thread the result
 * down as props instead of letting each consumer fetch independently.
 */
export function useBookmarkIcon(bookmarkId: string, url: string) {
  const { iconLinkService, iconBookmarkRepository } = useServices();
  const [resolved, setResolved] = useState<Resolved | undefined>(undefined);
  const key = `${bookmarkId}|${url}`;

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      iconLinkService.resolveForBookmark(bookmarkId, url),
      iconBookmarkRepository.getById(bookmarkId),
    ]).then(([result, row]) => {
      if (!cancelled) setResolved({ key, displayUrl: result.url, overrideUrl: row?.iconUrl });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` is derived from bookmarkId/url, listing it too would be redundant
  }, [bookmarkId, url, iconLinkService, iconBookmarkRepository]);

  const setOverride = async (value: string | undefined) => {
    const trimmed = value?.trim() || undefined;
    setResolved({ key, overrideUrl: trimmed, displayUrl: trimmed ?? resolveFaviconUrl(url) });
    if (trimmed) {
      await iconBookmarkRepository.save({ bookmarkId, iconUrl: trimmed });
    } else {
      await iconBookmarkRepository.remove(bookmarkId);
    }
  };

  const current = resolved?.key === key ? resolved : undefined;
  return { displayUrl: current?.displayUrl, overrideUrl: current?.overrideUrl, setOverride };
}
