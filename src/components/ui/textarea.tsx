import * as React from 'react';
import { clsx } from 'clsx';
import styles from './textarea.module.css';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea className={clsx(styles.textarea, className)} ref={ref} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
