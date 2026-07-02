import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Props {
  label: string;
  tag: string;
  desc: string;
  selected: boolean;
  showFallback?: boolean;
  onSelect: () => void;
}

export function ModeCard({ label, tag, desc, selected, showFallback, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex gap-[13px] text-left px-4 py-[15px] border rounded-[11px] cursor-pointer w-full transition-colors',
        selected ? 'border-accent bg-accent-soft' : 'border-border bg-bg2 hover:bg-hover',
      )}
    >
      <span
        className={cn(
          'w-[18px] h-[18px] rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors',
          selected ? 'border-accent bg-accent' : 'border-faint',
        )}
      >
        {selected && <span className="w-[7px] h-[7px] rounded-full bg-white block" />}
      </span>

      <span className="min-w-0">
        <span className="flex items-center gap-[9px]">
          <b className="text-[15px] font-bold text-text">{label}</b>
          <Badge variant="secondary">{tag}</Badge>
        </span>
        <span className="block mt-1 text-[13px] text-muted">{desc}</span>
        {showFallback && (
          <span className="flex items-center flex-wrap gap-[6px] mt-[10px] px-[11px] py-2 rounded-lg bg-bg3 text-[12.5px] text-muted font-mono">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--faint)" className="shrink-0">
              <path d="M3 6a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
            </svg>
            нет совпадений → <span className="text-text">Несортированные</span>
          </span>
        )}
      </span>
    </button>
  );
}
