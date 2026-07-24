import { clsx } from 'clsx';
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
}

export function BookmarkFavicon({ seed }: Props) {
  const letter = seed.charAt(0).toUpperCase() || '?';

  return <div className={clsx(styles.favicon, styles[colorForSeed(seed)])}>{letter}</div>;
}
