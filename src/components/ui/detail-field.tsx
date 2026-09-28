import type { ReactNode } from 'react';
import styles from './detail-field.module.css';

interface Props {
  label: string;
  children: ReactNode;
}

/** A labeled block inside a `*DetailPanel` (uppercase caption label above its content) — the shape every detail panel's fields already shared, pulled out once decomposing them into per-field subcomponents made the copy-pasted label markup show up in more places. */
export function DetailField({ label, children }: Props) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}
