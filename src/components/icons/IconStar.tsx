import type React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

export function IconStar({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5l2.9 6.3 6.7.7-5 4.7 1.4 6.8-6-3.6-6 3.6 1.4-6.8-5-4.7 6.7-.7z" />
    </svg>
  );
}
