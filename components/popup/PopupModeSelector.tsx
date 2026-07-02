import { cn } from '@/lib/utils';

export type Mode = 'auto' | 'hint' | 'off';

const MODES: { key: Mode; label: string }[] = [
  { key: 'auto', label: 'Авто' },
  { key: 'hint', label: 'Подсказка' },
  { key: 'off', label: 'Выключен' },
];

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function PopupModeSelector({ mode, onChange }: Props) {
  return (
    <div className="px-4 py-2">
      <div className="text-[10.5px] font-bold tracking-[0.07em] uppercase text-muted mb-2">
        Режим работы
      </div>
      <div className="flex gap-[3px] bg-bg2 border border-border rounded-[9px] p-[3px]">
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              'flex-1 px-1 py-[7px] border-0 rounded-[6px] cursor-pointer font-semibold text-xs transition-colors',
              mode === key
                ? 'bg-bg text-text shadow-sm'
                : 'bg-transparent text-muted hover:text-text',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
