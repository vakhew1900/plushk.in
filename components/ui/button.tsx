import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import styles from './button.module.css';

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'accent-soft' | 'dashed';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';

const VARIANT: Record<ButtonVariant, string> = {
  'default':     styles.vDefault,
  'outline':     styles.vOutline,
  'ghost':       styles.vGhost,
  'accent-soft': styles.vAccentSoft,
  'dashed':      styles.vDashed,
};

const SIZE: Record<ButtonSize, string> = {
  'default': styles.sizeMd,
  'sm':      styles.sizeSm,
  'lg':      styles.sizeLg,
  'icon':    styles.sizeIcon,
  'icon-sm': styles.sizeIconSm,
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={clsx(styles.btn, VARIANT[variant], SIZE[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
