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

interface Props {
  /** Text the initial and color are derived from — typically the domain. */
  seed: string;
  /** Full bookmark URL to resolve a real favicon for. Falls back to the letter when omitted or the icon fails to load. */
  url?: string;
}

export function BookmarkFavicon({ seed, url }: Props) {
  const [iconFailed, setIconFailed] = useState(false);
  const letter = seed.charAt(0).toUpperCase() || '?';
  const iconUrl = url ? resolveFaviconUrl(url) : undefined;

  return (
    <div className={clsx(styles.favicon, styles[colorForSeed(seed)])}>
      {iconUrl && !iconFailed ? (
        <img
          className={styles.icon}
          src={iconUrl}
          alt=""
          onError={() => setIconFailed(true)}
        />
      ) : (
        letter
      )}
    </div>
  );
}
