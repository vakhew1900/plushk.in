import { Button } from '@/components/ui/button';
import { IconSliders } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './PopupFiltersToggleButton.module.css';

interface Props {
  open: boolean;
  onToggle: () => void;
  activeCount: number;
}

export function PopupFiltersToggleButton({ open, onToggle, activeCount }: Props) {
  const { translate: t } = useTranslation();
  const active = open || activeCount > 0;

  return (
    <div className={styles.wrap}>
      <Button
        type="button"
        variant={active ? 'accent-soft' : 'outline'}
        size="icon"
        onClick={onToggle}
        aria-label={t('searchTab.filters.toggleButton')}
      >
        <IconSliders size="md" />
      </Button>
      {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
    </div>
  );
}
