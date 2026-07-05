import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { IconCheck } from '@/components/icons';
import type { Condition } from './ConditionGroup';
import { JsonView } from './JsonView';
import styles from './RuleEditor.module.css';

interface Group { conds: Condition[] }
interface Props { name: string; desc: string; groups: Group[] }

export function RuleEditor({ name, desc, groups }: Props) {
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
          <div className={styles.fieldLabel}>Название</div>
          <Input defaultValue={name} />
        </div>
        <div>
          <div className={styles.fieldLabel}>Описание</div>
          <Textarea defaultValue={desc} rows={2} />
        </div>
      </div>

      <div className={styles.condHeader}>
        <span className={styles.condTitle}>Условие</span>
      </div>

      <div className={styles.body}>
        <JsonView
          initialJson={JSON.stringify(jsonObj, null, 2)}
          filename={(slug || 'rule') + '.rule.json'}
        />
      </div>

      <div className={styles.editorFooter}>
        <Button variant="outline" size="sm">
          <IconCheck size={13} />
          Тест на текущей странице
        </Button>
        <div style={{ flex: 1 }} />
        <Button>Сохранить</Button>
      </div>
    </div>
  );
}
