import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './ConditionRow.module.css';

interface Props {
  field: string;
  opLabel: string;
  value: string;
  isNot?: boolean;
}

export function ConditionRow({ field, opLabel, value, isNot }: Props) {
  const { translate: t } = useTranslation();
  return (
    <div className={styles.row}>
      {isNot && <Badge variant="not-badge">{t('conditionRow.notBadge')}</Badge>}
      <Badge variant="mono">{field}</Badge>
      <span className={styles.op}>{opLabel}</span>
      <Badge variant="mono-accent">{value}</Badge>
    </div>
  );
}
