import { useState } from 'react';
import { resolveFaviconUrl } from '@/lib/browser-constants/faviconUrl';

export const FaviconColorVariant = { RED: 'red', BLUE: 'blue', GREEN: 'green', ACCENT: 'accent' } as const;
export type FaviconColorVariant = (typeof FaviconColorVariant)[keyof typeof FaviconColorVariant];

const COLOR_VARIANTS = Object.values(FaviconColorVariant);

function colorForSeed(seed: string): FaviconColorVariant {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return COLOR_VARIANTS[hash % COLOR_VARIANTS.length];
}

interface Params {
  /** Text the initial and color are derived from — typically the domain. */
  seed: string;
  /** Full bookmark URL to resolve a real favicon for. Only used when `iconUrl` is omitted. */
  url?: string;
  /** Already-resolved icon to show, taking precedence over `url`. */
  iconUrl?: string;
}

/**
 * Shared favicon-glyph state — seed-derived letter/color, the resolved icon
 * url, and broken-image tracking. Used by both `BookmarkFavicon` (small
 * glyph) and `BookmarkArtwork` (large cover), which render the same visual
 * shape but differ in when they're willing to show the image vs the letter
 * (see `BookmarkArtwork`'s `isRealArtwork` check).
 */
export function useFaviconGlyph({ seed, url, iconUrl }: Params) {
  const letter = seed.charAt(0).toUpperCase() || '?';
  const colorVariant = colorForSeed(seed);
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

  return {
    letter,
    colorVariant,
    resolvedIconUrl,
    iconAvailable: Boolean(resolvedIconUrl) && !iconFailed,
    onIconError: () => setIconFailed(true),
  };
}
