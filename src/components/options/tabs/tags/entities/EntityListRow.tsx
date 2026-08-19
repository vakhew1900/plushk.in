import { clsx } from 'clsx';
import { PaletteIconDot, PaletteIconDotSize } from '@/components/ui/palette-icon-dot';
import { useTranslation } from '@/hooks/useTranslation';
import type { EntityType } from '@/types/entity-type';
import styles from './EntityListRow.module.css';

interface Props {
  entity: EntityType;
  selected: boolean;
  onSelect: () => void;
}

export function EntityListRow({ entity, selected, onSelect }: Props) {
  const { translate: t } = useTranslation();
  const name = entity.name || t('entitiesSection.namePlaceholder');

  return (
    <button
      type="button"
      className={clsx(styles.row, selected && styles.selected)}
      onClick={onSelect}
    >
      <PaletteIconDot color={entity.color} icon={entity.icon} size={PaletteIconDotSize.MD} />
      <span className={styles.name} title={name}>{name}</span>
    </button>
  );
}
