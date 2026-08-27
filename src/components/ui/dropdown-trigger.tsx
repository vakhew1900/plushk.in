import * as React from 'react';
import { clsx } from 'clsx';
import { IconChevronDown } from '@/components/icons';
import styles from './dropdown-trigger.module.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const DropdownTriggerButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, active = false, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={clsx(styles.trigger, active && styles.active, className)}
      {...props}
    >
      <span className={styles.label}>{children}</span>
      <span className={styles.icon}>
        <IconChevronDown size="sm" />
      </span>
    </button>
  ),
);
DropdownTriggerButton.displayName = 'DropdownTriggerButton';
