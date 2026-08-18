import type React from 'react';
import { IconSize, ICON_SIZE_PX } from './icon-size';

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: IconSize };

export function IconStar({ size = IconSize.MD, ...props }: IconProps) {
  const px = ICON_SIZE_PX[size];
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6.3 6.7.7-5 4.7 1.4 6.8-6-3.6-6 3.6 1.4-6.8-5-4.7 6.7-.7z" />
    </svg>
  );
}
