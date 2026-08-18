import { clsx } from 'clsx';
import { PaletteDot, PaletteDotSize } from '@/components/ui/palette-dot';
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
      <PaletteDot color={entity.color} size={PaletteDotSize.MD} />
      <span className={styles.name} title={name}>{name}</span>
    </button>
  );
}
