import * as RadioGroup from '@radix-ui/react-radio-group';
import { useTranslation } from '@/hooks/useTranslation';
import { Mode } from '@/types/mode';
import styles from './PopupModeSelector.module.css';

const MODES: Mode[] = [Mode.AUTO, Mode.HINT, Mode.OFF];

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
