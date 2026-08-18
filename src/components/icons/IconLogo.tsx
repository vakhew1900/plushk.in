import type React from 'react';
import { IconSize, ICON_SIZE_PX } from './icon-size';

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: IconSize };

export function IconLogo({ size = IconSize.LG, ...props }: IconProps) {
  const px = ICON_SIZE_PX[size];
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="6"  cy="6"  r="2.4" fill="var(--accent)" />
      <circle cx="6"  cy="18" r="2.4" fill="var(--accent)" />
      <circle cx="18" cy="12" r="2.4" fill="var(--accent)" />
      <path d="M8 7l8 4M8 17l8-4" stroke="var(--accent)" strokeWidth="1.6" />
    </svg>
  );
}
