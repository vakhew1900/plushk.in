import * as RadioGroup from '@radix-ui/react-radio-group';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './PopupModeSelector.module.css';

export type Mode = 'auto' | 'hint' | 'off';

const MODES: Mode[] = ['auto', 'hint', 'off'];

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function PopupModeSelector({ mode, onChange }: Props) {
  const { translate: t } = useTranslation();
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>{t('common.modeSectionTitle')}</div>
      <RadioGroup.Root
        value={mode}
        onValueChange={(v) => onChange(v as Mode)}
        className={styles.group}
      >
        {MODES.map((value) => (
          <RadioGroup.Item key={value} value={value} className={styles.item}>
            {t(`modes.${value}.label`)}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
