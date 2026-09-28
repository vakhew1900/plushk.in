import { clsx } from 'clsx';
import styles from './QuickAddSpinner.module.css';

interface QuickAddSpinnerProps {
  /** Save button's spinner sits on the accent-colored background — needs a white ring, not the default border-colored one. */
  onAccent?: boolean;
}

export function QuickAddSpinner({ onAccent = false }: QuickAddSpinnerProps) {
  return <span className={clsx(styles.spinner, onAccent && styles.onAccent)} aria-hidden="true" />;
}
