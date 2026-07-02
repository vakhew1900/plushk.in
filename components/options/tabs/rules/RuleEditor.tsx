import { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConditionGroup } from './ConditionGroup';
import type { Condition } from './ConditionGroup';
import { JsonEditor } from './JsonEditor';
import styles from './RuleEditor.module.css';

interface Group { conds: Condition[] }
interface Props { name: string; desc: string; groups: Group[] }

type View = 'cons' | 'json';

export function RuleEditor({ name, desc, groups }: Props) {
  const [view, setView] = useState<View>('cons');

  const condCount = groups.reduce((n, g) => n + g.conds.length, 0);
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
        <RadioGroup.Root
          value={view}
          onValueChange={(v) => setView(v as View)}
          className={styles.viewToggle}
        >
          <RadioGroup.Item value="cons" className={styles.viewBtn}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="6" r="1.8" fill="currentColor" />
              <circle cx="6" cy="18" r="1.8" fill="currentColor" />
              <circle cx="17" cy="12" r="1.8" fill="currentColor" />
              <path d="M8 6.5l7 4.5M8 17.5l7-4.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Конструктор
          </RadioGroup.Item>
          <RadioGroup.Item value="json" className={`${styles.viewBtn} ${styles.viewBtnMono}`}>
            {'{ } JSON'}
          </RadioGroup.Item>
        </RadioGroup.Root>
      </div>

      <div className={styles.body}>
        {view === 'cons' && (
          <div>
            <div className={styles.orLabel}>
              <Badge variant="or-badge">ИЛИ · OR</Badge>
              <span className={styles.orText}>срабатывает любая из групп</span>
            </div>
            <div className={styles.condList}>
              {groups.map((g, i) => <ConditionGroup key={i} conds={g.conds} />)}
              <Button variant="dashed" style={{ width: '100%', color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Группа ИЛИ
              </Button>
            </div>
          </div>
        )}
        {view === 'json' && (
          <JsonEditor
            json={JSON.stringify(jsonObj, null, 2)}
            filename={(slug || 'rule') + '.rule.json'}
            condCount={condCount}
          />
        )}
      </div>

      <div className={styles.editorFooter}>
        <Button variant="outline" size="sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l4 4 10-10" />
          </svg>
          Тест на текущей странице
        </Button>
        <div style={{ flex: 1 }} />
        <Button>Сохранить</Button>
      </div>
    </div>
  );
}
