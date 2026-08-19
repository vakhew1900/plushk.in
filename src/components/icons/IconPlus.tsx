import type React from 'react';
import { Plus } from 'lucide-react';
import { IconSize, ICON_SIZE_PX } from './icon-size';

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: IconSize };

export function IconPlus({ size = IconSize.MD, ...props }: IconProps) {
  const px = ICON_SIZE_PX[size];
  return <Plus width={px} height={px} strokeWidth={2.2} strokeLinecap="butt" {...props} />;
}
