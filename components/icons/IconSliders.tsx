import type React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function IconSliders({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h9M19 7h1M4 17h5M15 17h5" />
      <circle cx="16" cy="7"  r="2.2" />
      <circle cx="11" cy="17" r="2.2" />
    </svg>
  );
}
