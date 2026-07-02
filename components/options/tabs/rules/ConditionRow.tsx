import { Badge } from '@/components/ui/badge';

interface Props {
  field: string;
  opLabel: string;
  value: string;
  isNot?: boolean;
}

export function ConditionRow({ field, opLabel, value, isNot }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isNot && <Badge variant="not-badge">НЕ</Badge>}
      <Badge variant="mono">{field}</Badge>
      <span className="text-xs text-muted">{opLabel}</span>
      <Badge variant="mono-accent">{value}</Badge>
    </div>
  );
}
