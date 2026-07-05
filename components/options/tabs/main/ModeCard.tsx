import { clsx } from 'clsx';
import { Badge } from '@/components/ui/badge';
import { IconFolder } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
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
  const { translate: t } = useTranslation();
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
            <IconFolder size={13} fill="var(--faint)" style={{ flexShrink: 0 }} />
            {t('common.noMatchFallback')} <span className={styles.fallbackText}>{t('common.uncategorizedFolder')}</span>
          </span>
        )}
      </span>
    </button>
  );
}
