import type React from 'react';
import { IconSize, ICON_SIZE_PX } from './icon-size';

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: IconSize };

export function IconTag({ size = IconSize.MD, ...props }: IconProps) {
  const px = ICON_SIZE_PX[size];
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.6 2.5H4.5A2 2 0 0 0 2.5 4.5v8.1a2 2 0 0 0 .59 1.42l9.9 9.9a2 2 0 0 0 2.82 0l7.68-7.68a2 2 0 0 0 0-2.82l-9.9-9.9a2 2 0 0 0-1.42-.6z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
