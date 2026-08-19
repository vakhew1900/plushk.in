import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { DropdownTriggerButton } from '@/components/ui/dropdown-trigger';
import { PaletteIconDot } from '@/components/ui/palette-icon-dot';
import { useTranslation } from '@/hooks/useTranslation';
import type { EntityType } from '@/types/entity-type';

interface Props {
  entityTypes: EntityType[];
  selectedEntityTypeId: string | undefined;
  onChange: (entityTypeId: string | undefined) => void;
}

export function CategoryFilterDropdown({ entityTypes, selectedEntityTypeId, onChange }: Props) {
  const { translate: t } = useTranslation();
  const selected = entityTypes.find((entity) => entity.id === selectedEntityTypeId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DropdownTriggerButton active={Boolean(selected)}>
          {selected ? selected.name : t('searchTab.filters.categoryLabel')}
        </DropdownTriggerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuCheckboxItem checked={!selected} onCheckedChange={() => onChange(undefined)}>
          {t('searchTab.filters.anyCategory')}
        </DropdownMenuCheckboxItem>
        {entityTypes.map((entity) => (
          <DropdownMenuCheckboxItem
            key={entity.id}
            checked={entity.id === selectedEntityTypeId}
            onCheckedChange={() => onChange(entity.id)}
          >
            <PaletteIconDot color={entity.color} icon={entity.icon} />
            {entity.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
