import type React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function IconHome({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 11l8-7 8 7M6 10v9h12v-9" />
    </svg>
  );
}
