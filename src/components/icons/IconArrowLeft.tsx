import type React from 'react';
import { ArrowLeft } from 'lucide-react';
import { IconSize, ICON_SIZE_PX } from './icon-size';

type IconProps = Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: IconSize };

export function IconArrowLeft({ size = IconSize.MD, ...props }: IconProps) {
  const px = ICON_SIZE_PX[size];
  return <ArrowLeft width={px} height={px} strokeWidth={2.4} {...props} />;
}
