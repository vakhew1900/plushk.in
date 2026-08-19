import type React from 'react';
import { Search } from 'lucide-react';
import { IconSize, ICON_SIZE_PX } from './icon-size';

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: IconSize };

export function IconSearch({ size = IconSize.MD, ...props }: IconProps) {
  const px = ICON_SIZE_PX[size];
  return <Search width={px} height={px} strokeWidth={2} {...props} />;
}
