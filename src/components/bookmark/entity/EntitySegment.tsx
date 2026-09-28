import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { PickerSearch } from '@/components/ui/picker-search';
import { PickerEmptyState } from '@/components/ui/picker-empty-state';
import { PaletteIconDot } from '@/components/ui/palette-icon-dot';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { filterByName } from '@/lib/name-filter';
import type { EntityType } from '@/types/entity-type';
import styles from './EntitySegment.module.css';

interface Props {
  entityTypes: EntityType[];
  selectedEntity: EntityType | undefined;
  onChoose: (entityTypeId: string | undefined) => void;
  /** Tints the label text with the selected entity's palette color instead of the default neutral text color. */
  colored?: boolean;
}

export function EntitySegment({ entityTypes, selectedEntity, onChoose, colored = false }: Props) {
  const { translate: t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const filteredEntityTypes = filterByName(entityTypes, query, (entity) => entity.name);

  const handleClick = (e: React.MouseEvent) => e.stopPropagation();

  // DropdownMenuContent's public API only exposes `onCloseAutoFocus`, not
  // `onOpenAutoFocus` — Radix's own mount-focus (usually the content root)
  // runs first regardless, so steal focus back to the search input on the
  // next frame instead of fighting it synchronously.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery('');
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={styles.segment}
          data-color={colored && selectedEntity ? selectedEntity.color : undefined}
          onClick={handleClick}
          title={selectedEntity ? t('bookmarkEntityControl.editTooltip') : undefined}
        >
          {selectedEntity ? (
            <>
              <PaletteIconDot color={selectedEntity.color} icon={selectedEntity.icon} size="sm" />
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
        {entityTypes.length > 0 && (
          <PickerSearch
            ref={inputRef}
            value={query}
            onChange={setQuery}
            placeholder={t('common.searchPlaceholder')}
            onKeyDown={(e) => e.stopPropagation()}
          />
        )}
        <DropdownMenuCheckboxItem checked={!selectedEntity} onCheckedChange={() => onChoose(undefined)}>
          {t('bookmarkEntityControl.noEntity')}
        </DropdownMenuCheckboxItem>
        {entityTypes.length > 0 && filteredEntityTypes.length === 0 && (
          <PickerEmptyState>{t('common.noSearchResults')}</PickerEmptyState>
        )}
        {filteredEntityTypes.map((entity) => (
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
