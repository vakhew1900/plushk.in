import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { QuickAddSearchingRow } from './QuickAddSearchingRow';
import { QuickAddEmptyBox } from './QuickAddEmptyBox';
import { QuickAddVariableSingle } from './QuickAddVariableSingle';
import { QuickAddVariableMultiple } from './QuickAddVariableMultiple';
import type { VariableMatch } from './quick-add-match';
import styles from './QuickAddVariablePreview.module.css';

interface QuickAddVariablePreviewProps {
  match: VariableMatch | undefined;
}

export function QuickAddVariablePreview({ match }: QuickAddVariablePreviewProps) {
  const { translate: t } = useTranslation();

  return (
    <div>
      <Text as="span" size="caption" tone="muted" className={styles.label}>{t('quickAdd.valueLabel')}</Text>

      {match === undefined && <QuickAddSearchingRow text={t('quickAdd.searchingVariable')} />}
      {match?.status === 'single' && <QuickAddVariableSingle value={match.values[0]} />}
      {match?.status === 'multiple' && <QuickAddVariableMultiple values={match.values} />}
      {match?.status === 'empty' && <QuickAddEmptyBox text={t('quickAdd.emptyVariable')} />}
    </div>
  );
}
