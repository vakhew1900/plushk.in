import { ColorPicker } from '@/components/ui/color-picker';
import { Input } from '@/components/ui/input';
import { IconX } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { PaletteColor } from '@/types/palette-color';
import styles from './WorkflowStatusRow.module.css';

interface Props {
  name: string;
  color: PaletteColor;
  isStart: boolean;
  onNameChange: (name: string) => void;
  onColorChange: (color: PaletteColor) => void;
  onRemove: () => void;
}

export function WorkflowStatusRow({ name, color, isStart, onNameChange, onColorChange, onRemove }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.row}>
      <ColorPicker value={color} onChange={onColorChange} />
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        onBlur={() => { if (!name.trim()) onRemove(); }}
        placeholder={t('entityDetail.statusNamePlaceholder')}
        className={styles.nameInput}
      />
      {isStart && <span className={styles.startHint}>{t('entityDetail.startStatusHint')}</span>}
      <button onClick={onRemove} className={styles.removeRow}><IconX size="sm" /></button>
    </div>
  );
}
