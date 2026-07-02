import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConditionRow } from './ConditionRow';

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
    <div className="border border-border border-l-[3px] border-l-blue rounded-[9px] bg-bg p-[12px_14px]">
      <div className="flex items-center gap-[9px] mb-[10px]">
        <Badge variant="and-badge">И · AND</Badge>
        <span className="text-[11.5px] text-muted">выполнены все условия</span>
        <button
          onClick={onRemove}
          className="ml-auto text-faint hover:text-red text-[15px] leading-none bg-transparent border-0 cursor-pointer transition-colors"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col gap-[7px]">
        {conds.map((c, i) => (
          <ConditionRow key={i} field={c.field} opLabel={c.opLabel} value={c.value} isNot={c.isNot} />
        ))}
        <Button variant="dashed" size="sm" className="self-start mt-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Условие
        </Button>
      </div>
    </div>
  );
}
