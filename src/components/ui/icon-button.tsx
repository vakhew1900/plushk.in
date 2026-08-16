import * as React from 'react';
import { clsx } from 'clsx';
import type { IconSize } from '@/components/icons/icon-size';
import styles from './icon-button.module.css';

export type IconButtonVariant = 'default' | 'danger';

const VARIANT: Record<IconButtonVariant, string> = {
  default: styles.vDefault,
  danger: styles.vDanger,
};

interface IconComponentProps {
  size?: IconSize;
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<IconComponentProps>;
  variant?: IconButtonVariant;
  iconSize?: IconSize;
}

/**
 * Icon-only action button — a `<button>` whose entire content is one icon
 * (remove/delete/add on a row or chip). Extracted after the same
 * `display:inline-flex; ...; color:var(--faint); :hover{color:...}` shape
 * turned up copy-pasted across ~10 call sites (tags/aliases/entities/rule
 * condition rows). See `RemoveIconButton` for the most common case
 * pre-configured.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, variant = 'default', iconSize = 'sm', className, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={clsx(styles.btn, VARIANT[variant], className)} {...props}>
      <Icon size={iconSize} />
    </button>
  ),
);
IconButton.displayName = 'IconButton';
