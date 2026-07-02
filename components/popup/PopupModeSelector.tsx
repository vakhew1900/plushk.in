import * as RadioGroup from '@radix-ui/react-radio-group';
import styles from './PopupModeSelector.module.css';

export type Mode = 'auto' | 'hint' | 'off';

const MODES: { value: Mode; label: string }[] = [
  { value: 'auto', label: 'Авто' },
  { value: 'hint', label: 'Подсказка' },
  { value: 'off',  label: 'Выключен' },
];

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function PopupModeSelector({ mode, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>Режим работы</div>
      <RadioGroup.Root
        value={mode}
        onValueChange={(v) => onChange(v as Mode)}
        className={styles.group}
      >
        {MODES.map(({ value, label }) => (
          <RadioGroup.Item key={value} value={value} className={styles.item}>
            {label}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
