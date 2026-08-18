import * as React from 'react';
import { clsx } from 'clsx';
import styles from './badge.module.css';

export type BadgeVariant =
  | 'accent' | 'secondary' | 'green' | 'red' | 'blue'
  | 'mono' | 'mono-accent' | 'or-badge' | 'and-badge' | 'not-badge';

const VARIANT: Record<BadgeVariant, string> = {
  'accent':     styles.accent,
  'secondary':  styles.secondary,
  'green':      styles.green,
  'red':        styles.red,
  'blue':       styles.blue,
  'mono':       styles.mono,
  'mono-accent':styles.monoAccent,
  'or-badge':   styles.orBadge,
  'and-badge':  styles.andBadge,
  'not-badge':  styles.notBadge,
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = 'accent', ...props }: BadgeProps) {
  return <span className={clsx(styles.badge, VARIANT[variant], className)} {...props} />;
}

export { Badge };
