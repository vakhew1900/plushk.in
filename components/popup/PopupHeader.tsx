import type { Mode } from './PopupModeSelector';

const MODE_LABELS: Record<Mode, string> = {
  auto: 'Авто',
  hint: 'Подсказка',
  off: 'Выключен',
};

interface Props {
  mode: Mode;
}

export function PopupHeader({ mode }: Props) {
  return (
    <div className="flex items-center gap-[11px] px-4 py-[15px] border-b border-border">
      <div className="w-8 h-8 rounded-[9px] bg-accent-soft flex items-center justify-center shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="6" r="2.4" fill="var(--accent)" />
          <circle cx="6" cy="18" r="2.4" fill="var(--accent)" />
          <circle cx="18" cy="12" r="2.4" fill="var(--accent)" />
          <path d="M8 7l8 4M8 17l8-4" stroke="var(--accent)" strokeWidth="1.6" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-bold text-[14.5px] text-text">Сортировщик</div>
        <div className="text-[11px] text-muted mt-px">Закладки</div>
      </div>

      <span className="flex items-center gap-[5px] text-[11px] font-semibold text-green shrink-0">
        <span className="w-[7px] h-[7px] rounded-full bg-green shadow-[0_0_8px_var(--green)]" />
        {MODE_LABELS[mode]}
      </span>
    </div>
  );
}
