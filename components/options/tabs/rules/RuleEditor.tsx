import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConditionGroup } from './ConditionGroup';
import type { Condition } from './ConditionGroup';
import { JsonEditor } from './JsonEditor';

interface Group { conds: Condition[] }
interface Props { name: string; desc: string; groups: Group[] }

type View = 'cons' | 'json';

function segBtn(active: boolean) {
  return cn(
    'flex items-center gap-[6px] px-[11px] py-[5px] border-0 rounded-[6px] cursor-pointer font-semibold text-xs transition-colors',
    active ? 'bg-bg text-text shadow-sm' : 'bg-transparent text-muted hover:text-text',
  );
}

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
    <div className="min-w-0 border border-border rounded-[13px] bg-bg2 overflow-hidden">
      {/* Name + desc */}
      <div className="px-[18px] py-4 border-b border-border space-y-3">
        <div>
          <div className="text-[10.5px] font-bold tracking-[0.06em] uppercase text-muted mb-1.5">Название</div>
          <Input defaultValue={name} />
        </div>
        <div>
          <div className="text-[10.5px] font-bold tracking-[0.06em] uppercase text-muted mb-1.5">Описание</div>
          <Textarea defaultValue={desc} rows={2} />
        </div>
      </div>

      {/* Condition toggle */}
      <div className="flex items-center justify-between px-[18px] py-[13px] border-b border-border">
        <span className="text-[13px] font-bold text-text">Условие</span>
        <div className="flex bg-bg border border-border rounded-lg p-[3px] gap-0.5">
          <button className={segBtn(view === 'cons')} onClick={() => setView('cons')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="6" r="1.8" fill="currentColor" />
              <circle cx="6" cy="18" r="1.8" fill="currentColor" />
              <circle cx="17" cy="12" r="1.8" fill="currentColor" />
              <path d="M8 6.5l7 4.5M8 17.5l7-4.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Конструктор
          </button>
          <button className={cn(segBtn(view === 'json'), 'font-mono')} onClick={() => setView('json')}>
            {'{ } JSON'}
          </button>
        </div>
      </div>

      {/* Builder / JSON */}
      <div className="p-[16px_18px]">
        {view === 'cons' && (
          <div>
            <div className="flex items-center gap-[9px] mb-3">
              <Badge variant="or-badge">ИЛИ · OR</Badge>
              <span className="text-xs text-muted">срабатывает любая из групп</span>
            </div>
            <div className="flex flex-col gap-[11px]">
              {groups.map((g, i) => <ConditionGroup key={i} conds={g.conds} />)}
              <Button variant="dashed" className="w-full text-accent border-accent/30">
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

      {/* Footer */}
      <div className="flex gap-[9px] px-[18px] py-[13px] border-t border-border bg-bg">
        <Button variant="outline" size="sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l4 4 10-10" />
          </svg>
          Тест на текущей странице
        </Button>
        <div className="flex-1" />
        <Button>Сохранить</Button>
      </div>
    </div>
  );
}
