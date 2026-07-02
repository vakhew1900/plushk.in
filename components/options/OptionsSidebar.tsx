import { cn } from '@/lib/utils';

export type Tab = 'main' | 'rules' | 'aliases';

interface Props {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  ruleCount: number;
}

function NavButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-[10px] px-[11px] py-2 rounded-lg cursor-pointer font-semibold text-[13px] text-left w-full border-0 transition-colors',
        active ? 'bg-accent-soft text-text' : 'bg-transparent text-muted hover:bg-hover hover:text-text',
      )}
    >
      {children}
    </button>
  );
}

export function OptionsSidebar({ tab, onTabChange, ruleCount }: Props) {
  return (
    <div className="w-[194px] shrink-0 bg-bg2 border-r border-border p-[14px_10px] flex flex-col gap-[3px]">
      <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-faint px-[10px] py-[6px]">
        Основное
      </div>

      <NavButton active={tab === 'main'} onClick={() => onTabChange('main')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 11l8-7 8 7M6 10v9h12v-9" />
        </svg>
        Главное
      </NavButton>

      <NavButton active={tab === 'rules'} onClick={() => onTabChange('rules')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="6" r="2" fill="currentColor" />
          <circle cx="6" cy="18" r="2" fill="currentColor" />
          <circle cx="17" cy="12" r="2" fill="currentColor" />
          <path d="M8 6.5l7 4.5M8 17.5l7-4.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Правила
        <span className="ml-auto text-[11px] text-faint font-mono">{ruleCount}</span>
      </NavButton>

      <NavButton active={tab === 'aliases'} onClick={() => onTabChange('aliases')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h9M19 7h1M4 17h5M15 17h5" />
          <circle cx="16" cy="7" r="2.2" />
          <circle cx="11" cy="17" r="2.2" />
        </svg>
        Алиасы
      </NavButton>
    </div>
  );
}
