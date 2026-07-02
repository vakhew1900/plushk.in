import type { Mode } from './PopupModeSelector';
import styles from './PopupHeader.module.css';

const MODE_LABELS: Record<Mode, string> = {
  auto: 'Авто',
  hint: 'Подсказка',
  off:  'Выключен',
};

interface Props { mode: Mode }

export function PopupHeader({ mode }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.icon}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="6"  cy="6"  r="2.4" fill="var(--accent)" />
          <circle cx="6"  cy="18" r="2.4" fill="var(--accent)" />
          <circle cx="18" cy="12" r="2.4" fill="var(--accent)" />
          <path d="M8 7l8 4M8 17l8-4" stroke="var(--accent)" strokeWidth="1.6" />
        </svg>
      </div>

      <div className={styles.meta}>
        <div className={styles.name}>Сортировщик</div>
        <div className={styles.sub}>Закладки</div>
      </div>

      <span className={styles.status}>
        <span className={styles.dot} />
        {MODE_LABELS[mode]}
      </span>
    </div>
  );
}
