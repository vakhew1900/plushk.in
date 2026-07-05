import type React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function IconLogo({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="6"  cy="6"  r="2.4" fill="var(--accent)" />
      <circle cx="6"  cy="18" r="2.4" fill="var(--accent)" />
      <circle cx="18" cy="12" r="2.4" fill="var(--accent)" />
      <path d="M8 7l8 4M8 17l8-4" stroke="var(--accent)" strokeWidth="1.6" />
    </svg>
  );
}
