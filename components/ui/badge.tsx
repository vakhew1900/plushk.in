import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center gap-1 font-semibold', {
  variants: {
    variant: {
      accent: 'px-2 py-0.5 rounded-[6px] bg-accent-soft text-accent text-[11.5px]',
      secondary: 'px-[7px] py-0.5 rounded-[5px] bg-bg3 text-muted text-[10.5px]',
      green: 'px-2 py-0.5 rounded-[6px] bg-green-soft text-green text-[11px]',
      red: 'px-2 py-0.5 rounded-[6px] bg-red-soft text-red text-[11px]',
      blue: 'px-2 py-0.5 rounded-[6px] bg-blue-soft text-blue text-[11px]',
      mono: 'px-[9px] py-1 rounded-[7px] bg-bg3 text-text font-mono text-[12.5px]',
      'mono-accent': 'px-[9px] py-1 rounded-[7px] bg-bg3 text-accent font-mono text-[12.5px]',
      'or-badge': 'px-[11px] py-1 rounded-[7px] bg-accent-soft text-accent border border-accent font-mono text-xs',
      'and-badge': 'px-[9px] py-[3px] rounded-[6px] bg-blue-soft text-blue font-mono text-[11px]',
      'not-badge': 'px-[9px] py-1 rounded-[6px] bg-red-soft text-red font-mono text-[11px]',
    },
  },
  defaultVariants: {
    variant: 'accent',
  },
});

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
