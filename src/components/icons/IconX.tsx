import type React from 'react';
import { X } from 'lucide-react';
import { IconSize, ICON_SIZE_PX } from './icon-size';

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: IconSize };

export function IconX({ size = IconSize.MD, ...props }: IconProps) {
  const px = ICON_SIZE_PX[size];
  return <X width={px} height={px} strokeWidth={2.4} strokeLinecap="round" {...props} />;
}
