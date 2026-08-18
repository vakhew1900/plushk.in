import * as React from 'react';
import { clsx } from 'clsx';
import styles from './input.module.css';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <input className={clsx(styles.input, className)} ref={ref} {...props} />
  ),
);
Input.displayName = 'Input';

export { Input };
