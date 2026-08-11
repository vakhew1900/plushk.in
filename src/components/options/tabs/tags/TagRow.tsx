import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import type { TagColor } from '@/types/tag';
import { TagColorPicker } from './TagColorPicker';
import styles from './TagRow.module.css';

interface Props {
  name: string;
  color: TagColor;
  onNameChange: (name: string) => void;
  onColorChange: (color: TagColor) => void;
  onRemove: () => void;
}

export function TagRow({ name, color, onNameChange, onColorChange, onRemove }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.row}>
      <TagColorPicker value={color} onChange={onColorChange} />
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={t('tagsSection.namePlaceholder')}
        className={styles.nameInput}
      />
      <button onClick={onRemove} className={styles.removeRow}>×</button>
    </div>
  );
}
