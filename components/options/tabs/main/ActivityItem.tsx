import { Badge } from '@/components/ui/badge';

interface Props {
  letter: string;
  color: string;
  title: string;
  folder: string;
  rule: string;
  time: string;
  isLast?: boolean;
}

export function ActivityItem({ letter, color, title, folder, rule, time, isLast }: Props) {
  return (
    <div className={`flex items-center gap-3 px-[14px] py-3 ${isLast ? '' : 'border-b border-border'}`}>
      <span
        className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center font-bold text-sm text-white shrink-0"
        style={{ background: color }}
      >
        {letter}
      </span>

      <span className="flex-1 min-w-0">
        <span className="block text-[13px] font-semibold text-text truncate">{title}</span>
        <span className="flex items-center gap-[5px] text-[11.5px] text-muted font-mono mt-0.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          </svg>
          {folder}
        </span>
      </span>

      <Badge variant="accent">{rule}</Badge>
      <span className="text-[11px] text-faint shrink-0 w-[74px] text-right">{time}</span>
    </div>
  );
}
