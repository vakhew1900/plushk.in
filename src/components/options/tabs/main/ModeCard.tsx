import { clsx } from 'clsx';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { IconFolder } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './ModeCard.module.css';

interface Props {
  label: string;
  tag: string;
  desc: string;
  selected: boolean;
  showFallback?: boolean;
  fallbackFolder?: string;
  onSelect: () => void;
}

export function ModeCard({ label, tag, desc, selected, showFallback, fallbackFolder, onSelect }: Props) {
  const { translate: t } = useTranslation();
  return (
    <button onClick={onSelect} className={clsx(styles.card, selected && styles.selected)}>
      <span className={styles.radio}>
        {selected && <span className={styles.radioDot} />}
      </span>

      <span className={styles.body}>
        <span className={styles.titleRow}>
          <Text as="b" size="subheading">{label}</Text>
          <Badge variant="secondary">{tag}</Badge>
        </span>
        <Text as="span" size="body" tone="muted" className={styles.desc}>{desc}</Text>
        {showFallback && (
          <span className={styles.fallback}>
            <IconFolder size="md" fill="var(--faint)" style={{ flexShrink: 0 }} />
            {t('common.noMatchFallback')} <span className={styles.fallbackText}>{fallbackFolder || t('common.bookmarksBar')}</span>
          </span>
        )}
      </span>
    </button>
  );
}
