import { clsx } from 'clsx';
import { Badge } from '@/components/ui/badge';
import styles from './ModeCard.module.css';

interface Props {
  label: string;
  tag: string;
  desc: string;
  selected: boolean;
  showFallback?: boolean;
  onSelect: () => void;
}

export function ModeCard({ label, tag, desc, selected, showFallback, onSelect }: Props) {
  return (
    <button onClick={onSelect} className={clsx(styles.card, selected && styles.selected)}>
      <span className={styles.radio}>
        {selected && <span className={styles.radioDot} />}
      </span>

      <span className={styles.body}>
        <span className={styles.titleRow}>
          <b className={styles.title}>{label}</b>
          <Badge variant="secondary">{tag}</Badge>
        </span>
        <span className={styles.desc}>{desc}</span>
        {showFallback && (
          <span className={styles.fallback}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--faint)" style={{ flexShrink: 0 }}>
              <path d="M3 6a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
            </svg>
            нет совпадений → <span className={styles.fallbackText}>Несортированные</span>
          </span>
        )}
      </span>
    </button>
  );
}
