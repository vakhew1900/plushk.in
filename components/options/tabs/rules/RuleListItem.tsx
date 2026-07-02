import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface Props {
  index: number;
  name: string;
  desc: string;
  enabled: boolean;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}

export function RuleListItem({ index, name, desc, enabled, selected, onSelect, onToggle }: Props) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative px-[15px] py-[13px] border rounded-[11px] cursor-pointer transition-colors',
        selected ? 'border-accent bg-accent-soft' : 'border-border bg-bg2 hover:bg-hover',
      )}
    >
      <div className="flex items-center gap-[9px] mb-[5px]">
        <span className="flex items-center justify-center w-[19px] h-[19px] rounded-[6px] bg-bg3 text-muted font-mono text-[11px] font-bold shrink-0">
          {index}
        </span>
        <b className="flex-1 text-[13.5px] font-bold text-text truncate">{name}</b>
        <span onClick={(e) => { e.stopPropagation(); onToggle(); }} className="shrink-0">
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </span>
      </div>
      <div className="text-[11.5px] text-muted leading-relaxed line-clamp-3">{desc}</div>
    </div>
  );
}
