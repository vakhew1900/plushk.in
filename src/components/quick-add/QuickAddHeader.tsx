import { IconLogo, IconX } from '@/components/icons';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './QuickAddHeader.module.css';

interface QuickAddHeaderProps {
  title: string;
  onClose: () => void;
}

export function QuickAddHeader({ title, onClose }: QuickAddHeaderProps) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.row}>
      <span className={styles.logo}>
        <IconLogo size="sm" />
      </span>
      <div className={styles.titles}>
        <Text size="caption" tone="muted">plushk.in</Text>
        <Text size="subheading" tone="default">{title}</Text>
      </div>
      <IconButton
        icon={IconX}
        variant="default"
        className={styles.closeButton}
        aria-label={t('quickAdd.close')}
        onClick={onClose}
      />
    </div>
  );
}
