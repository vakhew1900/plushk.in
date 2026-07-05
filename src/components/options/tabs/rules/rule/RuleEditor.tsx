import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { IconCheck } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { Condition } from '../condition/ConditionGroup';
import { JsonView } from '../json/JsonView';
import styles from './RuleEditor.module.css';

interface Group { conds: Condition[] }
interface Props {
  name: string;
  desc: string;
  groups: Group[];
  onNameChange: (name: string) => void;
  onDescChange: (desc: string) => void;
}

export function RuleEditor({ name, desc, groups, onNameChange, onDescChange }: Props) {
  const { translate: t } = useTranslation();
  const slug = name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '_').replace(/^_|_$/g, '');
  const jsonObj = {
    or: groups.map((g) => ({
      and: g.conds.map((c) => (c.isNot ? { not: { [c.field]: c.value } } : { [c.field]: c.value })),
    })),
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.nameSection}>
        <div>
          <div className={styles.fieldLabel}>{t('ruleEditor.nameLabel')}</div>
          <Input value={name} onChange={(e) => onNameChange(e.target.value)} />
        </div>
        <div>
          <div className={styles.fieldLabel}>{t('ruleEditor.descLabel')}</div>
          <Textarea value={desc} onChange={(e) => onDescChange(e.target.value)} rows={2} />
        </div>
      </div>

      <div className={styles.condHeader}>
        <span className={styles.condTitle}>{t('ruleEditor.conditionTitle')}</span>
      </div>

      <div className={styles.body}>
        <JsonView
          json={JSON.stringify(jsonObj, null, 2)}
          filename={(slug || 'rule') + '.rule.json'}
        />
      </div>

      <div className={styles.editorFooter}>
        <Button variant="outline" size="sm">
          <IconCheck size={13} />
          {t('ruleEditor.testButton')}
        </Button>
        <div style={{ flex: 1 }} />
        <Button>{t('ruleEditor.saveButton')}</Button>
      </div>
    </div>
  );
}
