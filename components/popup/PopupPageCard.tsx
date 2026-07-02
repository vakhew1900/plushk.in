import { Badge } from '@/components/ui/badge';

export function PopupPageCard() {
  return (
    <div className="px-4 pt-2 pb-1">
      <div className="border border-border rounded-[11px] overflow-hidden bg-bg2">
        {/* Site info */}
        <div className="flex gap-[11px] p-[12px_13px]">
          <div className="w-[34px] h-[34px] rounded-lg bg-red-soft text-red flex items-center justify-center font-bold text-base shrink-0">
            r
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[13.5px] text-text truncate">
              r/webdev — Show your project
            </div>
            <div className="text-[11.5px] text-muted font-mono truncate mt-0.5">
              reddit.com · alias: reddit
            </div>
          </div>
        </div>

        {/* Matched rule */}
        <div className="border-t border-border p-[11px_13px] bg-bg">
          <div className="flex items-center gap-[7px] mb-2">
            <span className="text-[11px] text-muted">Совпало правило</span>
            <Badge variant="accent">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12l4 4 10-10" />
              </svg>
              Соцсети
            </Badge>
          </div>

          <div className="flex items-center gap-[6px] text-[12.5px] font-mono flex-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--muted)" className="shrink-0">
              <path d="M3 6a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
            </svg>
            <span className="text-muted">Bookmarks</span>
            <span className="text-faint">/</span>
            <span className="text-muted">Соцсети</span>
            <span className="text-faint">/</span>
            <span className="text-accent font-semibold">Reddit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
