import type { Mode } from './PopupModeSelector';
import { IconLogo } from '@/components/icons';
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
        <IconLogo size={20} />
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
