import { Button } from '@/components/ui/button';
import type { Mode } from './PopupModeSelector';
import styles from './PopupActions.module.css';

const ACTION_LABELS: Record<Mode, string> = {
  auto: 'Сохранить автоматически',
  hint: 'Подтвердить и сохранить',
  off:  'Сохранить в Закладки',
};

interface Props { mode: Mode }

export function PopupActions({ mode }: Props) {
  return (
    <div className={styles.wrap}>
      <Button size="lg" style={{ width: '100%' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
        </svg>
        {ACTION_LABELS[mode]}
      </Button>
      <Button variant="outline" style={{ width: '100%' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
        </svg>
        Изменить папку
      </Button>
    </div>
  );
}
