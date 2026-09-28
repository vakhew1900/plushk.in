import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { QuickAddChip } from './QuickAddChip';
import styles from './QuickAddVariableMultiple.module.css';

const MAX_VISIBLE_CHIPS = 3;

interface QuickAddVariableMultipleProps {
  values: string[];
}

export function QuickAddVariableMultiple({ values }: QuickAddVariableMultipleProps) {
  const { translate: t } = useTranslation();
  const hiddenCount = values.length - MAX_VISIBLE_CHIPS;

  return (
    <>
      <div className={styles.chipList}>
        {values.slice(0, MAX_VISIBLE_CHIPS).map((value, i) => (
          <QuickAddChip key={`${i}-${value}`}>
            <Text size="caption">{value}</Text>
          </QuickAddChip>
        ))}
      </div>
      {hiddenCount > 0 && (
        <Text as="div" size="caption" tone="muted">{t('quickAdd.hiddenCount', { count: hiddenCount })}</Text>
      )}
    </>
  );
}
