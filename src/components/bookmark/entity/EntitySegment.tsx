import type React from 'react';
import { clsx } from 'clsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { PaletteDot } from '@/components/ui/palette-dot';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { EntityType } from '@/types/entity-type';
import styles from './EntitySegment.module.css';

interface Props {
  entityTypes: EntityType[];
  selectedEntity: EntityType | undefined;
  standalone: boolean;
  onChoose: (entityTypeId: string | undefined) => void;
}

export function EntitySegment({ entityTypes, selectedEntity, standalone, onChoose }: Props) {
  const { translate: t } = useTranslation();
  const handleClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={clsx(styles.segment, standalone && styles.standalone)}
          title={selectedEntity ? t('bookmarkEntityControl.editTooltip') : undefined}
        >
          {selectedEntity ? (
            <>
              <PaletteDot color={selectedEntity.color} />
              {selectedEntity.name}
            </>
          ) : (
            <>
              <IconPlus size="sm" />
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
            <PaletteDot color={entity.color} />
            {entity.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
