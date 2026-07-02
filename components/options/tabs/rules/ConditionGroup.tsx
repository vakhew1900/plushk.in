import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  return (
    <div className={styles.group}>
      <div className={styles.header}>
        <Badge variant="and-badge">И · AND</Badge>
        <span className={styles.headerText}>выполнены все условия</span>
        <button onClick={onRemove} className={styles.removeBtn}>×</button>
      </div>

      <div className={styles.rows}>
        {conds.map((c, i) => (
          <ConditionRow key={i} field={c.field} opLabel={c.opLabel} value={c.value} isNot={c.isNot} />
        ))}
        <Button variant="dashed" size="sm" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Условие
        </Button>
      </div>
    </div>
  );
}
