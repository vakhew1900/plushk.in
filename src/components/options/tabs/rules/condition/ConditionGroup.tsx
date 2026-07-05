import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { ConditionRow } from './ConditionRow';
import styles from './ConditionGroup.module.css';

export interface Condition {
  field: string;
  opLabel: string;
  value: string;
  isNot?: boolean;
}

interface Props {
  conds: Condition[];
  onRemove?: () => void;
}

export function ConditionGroup({ conds, onRemove }: Props) {
  const { translate: t } = useTranslation();
  return (
    <div className={styles.group}>
      <div className={styles.header}>
        <Badge variant="and-badge">{t('conditionGroup.andBadge')}</Badge>
        <span className={styles.headerText}>{t('conditionGroup.andDesc')}</span>
        <button onClick={onRemove} className={styles.removeBtn}>×</button>
      </div>

      <div className={styles.rows}>
        {conds.map((c, i) => (
          <ConditionRow key={i} field={c.field} opLabel={c.opLabel} value={c.value} isNot={c.isNot} />
        ))}
        <Button variant="dashed" size="sm" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
          <IconPlus size={11} />
          {t('conditionGroup.addCondition')}
        </Button>
      </div>
    </div>
  );
}
