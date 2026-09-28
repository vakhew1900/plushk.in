import { clsx } from 'clsx';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import type { QuickAddStatus } from './quick-add-status';
import styles from './QuickAddSelectorField.module.css';

const TONE_CLASS: Record<QuickAddStatus, string> = {
  searching: styles.toneSearching,
  ok: styles.toneOk,
  empty: styles.toneEmpty,
};

interface QuickAddSelectorFieldProps {
  selector: string;
  status: QuickAddStatus;
}

export function QuickAddSelectorField({ selector, status }: QuickAddSelectorFieldProps) {
  const { translate: t } = useTranslation();

  return (
    <div>
      <Text as="div" size="caption" tone="muted">{t('quickAdd.selectorLabel')}</Text>
      <div className={clsx(styles.pill, TONE_CLASS[status])}>{selector}</div>
    </div>
  );
}
