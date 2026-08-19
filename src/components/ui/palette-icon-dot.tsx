import { clsx } from 'clsx';
import type { PaletteColor } from '@/types/palette-color';
import type { IconName } from '@/types/icon-name';
import { IconSize } from '@/components/icons/icon-size';
import { ICON_REGISTRY } from '@/components/icons/icon-registry';
import styles from './palette-icon-dot.module.css';

export const PaletteIconDotSize = { MD: 'md', LG: 'lg' } as const;
export type PaletteIconDotSize = (typeof PaletteIconDotSize)[keyof typeof PaletteIconDotSize];

interface Props {
  color: PaletteColor;
  icon?: IconName;
  size?: PaletteIconDotSize;
  className?: string;
}

/**
 * Same role as `PaletteDot` (a colored circle for an entity's `color`), but
 * sized to also hold its optional `icon` — used only where `EntityType.icon`
 * can be shown. `PaletteDot` stays the plain swatch for tags/workflow statuses,
 * which never carry an icon.
 */
export function PaletteIconDot({ color, icon, size = PaletteIconDotSize.MD, className }: Props) {
  const Icon = icon ? ICON_REGISTRY[icon] : undefined;
  return (
    <span className={clsx(styles.dot, className)} data-color={color} data-size={size}>
      {Icon && <Icon size={IconSize.LG} />}
    </span>
  );
}
