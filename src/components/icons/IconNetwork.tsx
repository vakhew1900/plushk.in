import type React from 'react';
import { IconSize, ICON_SIZE_PX } from './icon-size';

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: IconSize };

export function IconNetwork({ size = IconSize.MD, ...props }: IconProps) {
  const px = ICON_SIZE_PX[size];
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="6"  cy="6"  r="2"   fill="currentColor" />
      <circle cx="6"  cy="18" r="2"   fill="currentColor" />
      <circle cx="17" cy="12" r="2"   fill="currentColor" />
      <path d="M8 6.5l7 4.5M8 17.5l7-4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
