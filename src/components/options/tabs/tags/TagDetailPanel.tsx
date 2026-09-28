import { ColorPicker } from '@/components/ui/color-picker';
import { Input } from '@/components/ui/input';
import { DetailField } from '@/components/ui/detail-field';
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
      <DetailField label={t('entityDetail.nameLabel')}>
        <div className={styles.nameRow}>
          <ColorPicker value={color} onChange={onColorChange} />
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => { if (!name.trim()) onRemove(); }}
            placeholder={t('tagsSection.namePlaceholder')}
            className={styles.nameInput}
          />
          <RemoveIconButton onClick={onRemove} />
        </div>
      </DetailField>
    </div>
  );
}
