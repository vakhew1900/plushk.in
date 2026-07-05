import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { RuleListItem } from './rules/RuleListItem';
import { RuleEditor } from './rules/RuleEditor';
import type { Condition } from './rules/ConditionGroup';
import styles from './RulesTab.module.css';

interface Group { conds: Condition[] }
interface Rule { name: string; desc: string; enabled: boolean; groups: Group[] }

const INITIAL_RULES: Rule[] = [
  {
    name: 'Соцсети',
    desc: 'Facebook, Reddit, Pinterest и другие соцсети → папка «Соцсети». Региональные зеркала ловятся через алиасы.',
    enabled: true,
    groups: [
      { conds: [{ field: 'alias', opLabel: 'равно', value: 'reddit' }, { field: 'title', opLabel: 'не равно', value: 'ad', isNot: true }] },
      { conds: [{ field: 'alias', opLabel: 'равно', value: 'facebook' }] },
    ],
  },
  {
    name: 'Чтение / Лонгриды',
    desc: 'Habr и длинные статьи (более 800 слов или тег article) → папка «Чтение».',
    enabled: true,
    groups: [
      { conds: [{ field: 'alias', opLabel: 'равно', value: 'habr' }, { field: 'tag', opLabel: 'равно', value: 'article' }] },
    ],
  },
  {
    name: 'Дизайн-инспирация',
    desc: 'Pinterest и дизайн-ресурсы с UI в заголовке → папка «Инспирация».',
    enabled: false,
    groups: [
      { conds: [{ field: 'alias', opLabel: 'равно', value: 'dribbble' }, { field: 'title', opLabel: 'содержит', value: 'UI' }] },
    ],
  },
];

export function RulesTab() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [sel, setSel] = useState(0);
  const { translate: t } = useTranslation();

  const toggle = (i: number) =>
    setRules((prev) => prev.map((r, idx) => (idx === i ? { ...r, enabled: !r.enabled } : r)));

  const selected = rules[sel] ?? rules[0];

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.h1}>{t('nav.rules')}</h1>
          <p className={styles.lead}>{t('rulesTab.lead')}</p>
        </div>
        <Button>
          <IconPlus size={15} />
          {t('rulesTab.addRule')}
        </Button>
      </div>

      <div className={styles.grid}>
        <div className={styles.list}>
          {rules.map((r, i) => (
            <RuleListItem
              key={i}
              index={i + 1}
              name={r.name}
              desc={r.desc}
              enabled={r.enabled}
              selected={sel === i}
              onSelect={() => setSel(i)}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        <RuleEditor name={selected.name} desc={selected.desc} groups={selected.groups} />
      </div>
    </div>
  );
}
