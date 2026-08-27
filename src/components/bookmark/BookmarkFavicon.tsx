import { clsx } from 'clsx';
import { useState } from 'react';
import { resolveFaviconUrl } from '@/lib/browser-constants/faviconUrl';
import styles from './BookmarkFavicon.module.css';

const COLOR_VARIANTS = ['red', 'blue', 'green', 'accent'] as const;
type ColorVariant = typeof COLOR_VARIANTS[number];

function colorForSeed(seed: string): ColorVariant {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return COLOR_VARIANTS[hash % COLOR_VARIANTS.length];
}

export const BookmarkFaviconSize = { SM: 'sm', MD: 'md', WIDE: 'wide', XL: 'xl' } as const;
export type BookmarkFaviconSize = (typeof BookmarkFaviconSize)[keyof typeof BookmarkFaviconSize];

interface Props {
  /** Text the initial and color are derived from — typically the domain. */
  seed: string;
  /** Full bookmark URL to resolve a real favicon for. Only used when `iconUrl` is omitted. */
  url?: string;
  /** Already-resolved icon to show (from `useBookmarkIcon` — RULE-13/UI-15's IconRule/manual-override result), taking precedence over `url`. */
  iconUrl?: string;
  size?: BookmarkFaviconSize;
}

export function BookmarkFavicon({ seed, url, iconUrl, size = BookmarkFaviconSize.MD }: Props) {
  const letter = seed.charAt(0).toUpperCase() || '?';
  const resolvedIconUrl = iconUrl ?? (url ? resolveFaviconUrl(url) : undefined);

  // Reset the broken-image flag when the icon actually changes (e.g. the
  // settings dialog just wrote a new override) — otherwise a previous
  // failure would stick and mask a since-fixed, perfectly valid url.
  const [iconFailed, setIconFailed] = useState(false);
  const [lastIconUrl, setLastIconUrl] = useState(resolvedIconUrl);
  if (resolvedIconUrl !== lastIconUrl) {
    setLastIconUrl(resolvedIconUrl);
    setIconFailed(false);
  }

  return (
    <div className={clsx(styles.favicon, styles[colorForSeed(seed)])} data-size={size}>
      {resolvedIconUrl && !iconFailed ? (
        <img
          className={styles.icon}
          src={resolvedIconUrl}
          alt=""
          onError={() => setIconFailed(true)}
        />
      ) : (
        letter
      )}
    </div>
  );
}
