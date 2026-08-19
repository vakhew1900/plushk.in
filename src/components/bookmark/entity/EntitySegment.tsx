import type React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { PaletteIconDot } from '@/components/ui/palette-icon-dot';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { EntityType } from '@/types/entity-type';
import styles from './EntitySegment.module.css';

interface Props {
  entityTypes: EntityType[];
  selectedEntity: EntityType | undefined;
  onChoose: (entityTypeId: string | undefined) => void;
}

export function EntitySegment({ entityTypes, selectedEntity, onChoose }: Props) {
  const { translate: t } = useTranslation();
  const handleClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={styles.segment}
          onClick={handleClick}
          title={selectedEntity ? t('bookmarkEntityControl.editTooltip') : undefined}
        >
          {selectedEntity ? (
            <>
              <PaletteIconDot color={selectedEntity.color} icon={selectedEntity.icon} size="md" />
              {selectedEntity.name}
            </>
          ) : (
            <>
              <IconPlus size="md" />
              {t('bookmarkEntityControl.addEntity')}
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={handleClick}>
        <DropdownMenuCheckboxItem checked={!selectedEntity} onCheckedChange={() => onChoose(undefined)}>
          {t('bookmarkEntityControl.noEntity')}
        </DropdownMenuCheckboxItem>
        {entityTypes.map((entity) => (
          <DropdownMenuCheckboxItem
            key={entity.id}
            checked={entity.id === selectedEntity?.id}
            onCheckedChange={() => onChoose(entity.id)}
          >
            <PaletteIconDot color={entity.color} icon={entity.icon} />
            {entity.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
