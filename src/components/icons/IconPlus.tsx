import type React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function IconPlus({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
