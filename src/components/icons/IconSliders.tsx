import type React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { IconSize, ICON_SIZE_PX } from './icon-size';

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: IconSize };

export function IconSliders({ size = IconSize.MD, ...props }: IconProps) {
  const px = ICON_SIZE_PX[size];
  return <SlidersHorizontal width={px} height={px} strokeWidth={1.8} strokeLinecap="butt" {...props} />;
}
