import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-white border-0 hover:brightness-110',
        outline: 'bg-bg2 text-text border border-border hover:bg-hover',
        ghost: 'bg-transparent text-muted border-0 hover:bg-hover hover:text-text',
        'accent-soft': 'bg-accent-soft text-accent border-0 hover:brightness-105',
        dashed: 'bg-transparent text-muted border border-dashed border-border hover:bg-hover',
      },
      size: {
        default: 'h-9 px-4 rounded-[9px] text-[13px]',
        sm: 'h-8 px-3 rounded-lg text-xs',
        lg: 'h-[42px] px-4 rounded-[9px] text-[13px]',
        icon: 'h-9 w-9 rounded-lg',
        'icon-sm': 'h-7 w-7 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
