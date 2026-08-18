export const IconSize = { SM: 'sm', MD: 'md', LG: 'lg' } as const;
export type IconSize = typeof IconSize[keyof typeof IconSize];

/** px equivalents of the --icon-size-* rem tokens in assets/globals.css (1rem = 16px). */
export const ICON_SIZE_PX: Record<IconSize, number> = {
  [IconSize.SM]: 14,
  [IconSize.MD]: 16,
  [IconSize.LG]: 20,
};
