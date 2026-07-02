import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RuleListItem } from './rules/RuleListItem';
import { RuleEditor } from './rules/RuleEditor';
import type { Condition } from './rules/ConditionGroup';

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

  const toggle = (i: number) =>
    setRules((prev) => prev.map((r, idx) => (idx === i ? { ...r, enabled: !r.enabled } : r)));

  const selected = rules[sel] ?? rules[0];

  return (
    <div>
      <div className="flex items-start gap-4 mb-5">
        <div className="flex-1">
          <h1 className="m-0 mb-1 text-[22px] font-bold text-text">Правила</h1>
          <p className="m-0 text-[13.5px] text-muted">Проверяются сверху вниз — побеждает первое совпадение.</p>
        </div>
        <Button>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Правило
        </Button>
      </div>

      <div className="grid gap-[18px] items-start" style={{ gridTemplateColumns: '262px minmax(0,1fr)' }}>
        <div className="flex flex-col gap-[9px]">
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
