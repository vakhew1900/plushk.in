import { ColorPicker } from '@/components/ui/color-picker';
import { Input } from '@/components/ui/input';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { useTranslation } from '@/hooks/useTranslation';
import type { PaletteColor } from '@/types/palette-color';
import styles from './TagDetailPanel.module.css';

interface Props {
  name: string;
  color: PaletteColor;
  onNameChange: (name: string) => void;
  onColorChange: (color: PaletteColor) => void;
  onRemove: () => void;
}

export function TagDetailPanel({ name, color, onNameChange, onColorChange, onRemove }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.panel}>
      <div className={styles.field}>
        <span className={styles.label}>{t('tagsSection.colorLabel')}</span>
        <ColorPicker value={color} onChange={onColorChange} />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{t('entityDetail.nameLabel')}</span>
        <div className={styles.nameRow}>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => { if (!name.trim()) onRemove(); }}
            placeholder={t('tagsSection.namePlaceholder')}
            className={styles.nameInput}
          />
          <RemoveIconButton onClick={onRemove} />
        </div>
      </div>
    </div>
  );
}
