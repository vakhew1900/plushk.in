import { clsx } from 'clsx';
import { useFaviconGlyph } from '@/hooks/useFaviconGlyph';
import { IconResultType } from '@/services/interfaces/IIconLinkService';
import styles from './FaviconGlyph.module.css';

export const BookmarkArtworkSize = { WIDE: 'wide', XL: 'xl' } as const;
export type BookmarkArtworkSize = (typeof BookmarkArtworkSize)[keyof typeof BookmarkArtworkSize];

interface Props {
  /** Text the initial and color are derived from — typically the domain. */
  seed: string;
  /** Resolved icon from `useBookmarkIcon` — shown only when `iconType` says it's real artwork. */
  iconUrl: string | undefined;
  /** `'rule'` (an `IconRule` match or a manual override) vs `'default'` (plain favicon fallback). */
  iconType: IconResultType | undefined;
  size?: BookmarkArtworkSize;
}

/**
 * Large cover-image slot — Library card (`wide`) and the bookmark settings
 * preview (`xl`). Unlike `BookmarkFavicon`, it deliberately refuses to show
 * a plain favicon here: favicons are fetched at a fixed 32px (see
 * `faviconUrl.ts`), and stretching that to fill a 7rem/11rem box just turns
 * it into a blurry, pixelated mess. It only renders the image when
 * `iconType` confirms it's real artwork (an `IconRule` match or a manual
 * override); otherwise it falls back to the same seed-derived letter as a
 * missing/broken icon would.
 */
export function BookmarkArtwork({ seed, iconUrl, iconType, size = BookmarkArtworkSize.WIDE }: Props) {
  const { letter, colorVariant, resolvedIconUrl, iconAvailable, onIconError } = useFaviconGlyph({
    seed,
    iconUrl,
  });
  const isRealArtwork = iconType === IconResultType.RULE;

  return (
    <div className={clsx(styles.favicon, styles[colorVariant])} data-size={size}>
      {iconAvailable && isRealArtwork ? (
        <img className={styles.icon} src={resolvedIconUrl} alt="" onError={onIconError} />
      ) : (
        letter
      )}
    </div>
  );
}
