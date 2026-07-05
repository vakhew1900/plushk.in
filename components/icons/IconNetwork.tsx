import type React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function IconNetwork({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="6"  cy="6"  r="2"   fill="currentColor" />
      <circle cx="6"  cy="18" r="2"   fill="currentColor" />
      <circle cx="17" cy="12" r="2"   fill="currentColor" />
      <path d="M8 6.5l7 4.5M8 17.5l7-4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
