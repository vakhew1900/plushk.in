import { Button } from '@/components/ui/button';
import { IconBookmark, IconFolder } from '@/components/icons';
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
        <IconBookmark size={15} />
        {ACTION_LABELS[mode]}
      </Button>
      <Button variant="outline" style={{ width: '100%' }}>
        <IconFolder size={14} />
        Изменить папку
      </Button>
    </div>
  );
}
