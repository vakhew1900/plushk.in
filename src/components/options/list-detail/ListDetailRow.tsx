import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import styles from './ListDetailRow.module.css';

interface Props {
  name: string;
  selected: boolean;
  leading?: ReactNode;
  onSelect: () => void;
}

export function ListDetailRow({ name, selected, leading, onSelect }: Props) {
  return (
    <button type="button" className={clsx(styles.row, selected && styles.selected)} onClick={onSelect}>
      {leading}
      <span className={styles.name} title={name}>{name}</span>
    </button>
  );
}
