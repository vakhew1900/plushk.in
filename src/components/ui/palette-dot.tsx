import { clsx } from 'clsx';
import type { PaletteColor } from '@/types/palette-color';
import styles from './palette-dot.module.css';

export const PaletteDotSize = { SM: 'sm', MD: 'md' } as const;
export type PaletteDotSize = (typeof PaletteDotSize)[keyof typeof PaletteDotSize];

interface Props {
  color: PaletteColor;
  size?: PaletteDotSize;
  className?: string;
}

export function PaletteDot({ color, size = PaletteDotSize.SM, className }: Props) {
  return <span className={clsx(styles.dot, className)} data-color={color} data-size={size} />;
}
