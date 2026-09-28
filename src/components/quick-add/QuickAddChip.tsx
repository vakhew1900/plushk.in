import type { ReactNode } from 'react';
import styles from './QuickAddChip.module.css';

interface QuickAddChipProps {
  children: ReactNode;
}

/** Shared by QuickAddVariableSingle/QuickAddVariableMultiple — same box, one value or a list of them. */
export function QuickAddChip({ children }: QuickAddChipProps) {
  return <div className={styles.chip}>{children}</div>;
}
