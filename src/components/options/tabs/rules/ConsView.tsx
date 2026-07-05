import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { ConditionGroup } from './ConditionGroup';
import type { Condition } from './ConditionGroup';
import styles from './ConsView.module.css';

interface Group { conds: Condition[] }

interface Props {
  groups: Group[];
}

export function ConsView({ groups }: Props) {
  const { translate: t } = useTranslation();
  return (
    <div>
      <div className={styles.orLabel}>
        <Badge variant="or-badge">{t('consView.orBadge')}</Badge>
        <span className={styles.orText}>{t('consView.orDesc')}</span>
      </div>
      <div className={styles.list}>
        {groups.map((g, i) => (
          <ConditionGroup key={i} conds={g.conds} />
        ))}
        <Button
          variant="dashed"
          style={{
            width: '100%',
            color: 'var(--accent)',
            borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
          }}
        >
          <IconPlus size={13} />
          {t('consView.addGroup')}
        </Button>
      </div>
    </div>
  );
}
