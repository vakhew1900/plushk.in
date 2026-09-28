import type { ReactNode } from 'react';
import styles from './picker-empty-state.module.css';

interface Props {
  children: ReactNode;
}

/** A muted placeholder row inside a `Popover`/`DropdownMenu` picker — "no items at all" or "nothing matches the search". */
export function PickerEmptyState({ children }: Props) {
  return <div className={styles.empty}>{children}</div>;
}
