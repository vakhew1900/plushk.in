import { clsx } from 'clsx';
import { useFaviconGlyph } from '@/hooks/useFaviconGlyph';
import styles from './FaviconGlyph.module.css';

export const BookmarkFaviconSize = { SM: 'sm', MD: 'md' } as const;
export type BookmarkFaviconSize = (typeof BookmarkFaviconSize)[keyof typeof BookmarkFaviconSize];

interface Props {
  /** Text the initial and color are derived from — typically the domain. */
  seed: string;
  /** Full bookmark URL to resolve a real favicon for. Only used when `iconUrl` is omitted. */
  url?: string;
  /** Already-resolved icon to show (from `useBookmarkIcon`), taking precedence over `url`. */
  iconUrl?: string;
  size?: BookmarkFaviconSize;
}

/**
 * Small favicon glyph — popup and compact-card sizes only. Always shows the
 * resolved icon inset in a small box when one is available; unlike
 * `BookmarkArtwork`, it has no notion of "real artwork vs plain favicon"
 * because at this size a stretched-and-blurry favicon isn't a concern.
 */
export function BookmarkFavicon({ seed, url, iconUrl, size = BookmarkFaviconSize.MD }: Props) {
  const { letter, colorVariant, resolvedIconUrl, iconAvailable, onIconError } = useFaviconGlyph({
    seed,
    url,
    iconUrl,
  });

  return (
    <div className={clsx(styles.favicon, styles[colorVariant])} data-size={size}>
      {iconAvailable ? (
        <img className={styles.icon} src={resolvedIconUrl} alt="" onError={onIconError} />
      ) : (
        letter
      )}
    </div>
  );
}
