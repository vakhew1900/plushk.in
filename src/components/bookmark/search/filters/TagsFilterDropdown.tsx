import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { DropdownTriggerButton } from '@/components/ui/dropdown-trigger';
import { PaletteDot } from '@/components/ui/palette-dot';
import { useTranslation } from '@/hooks/useTranslation';
import type { Tag } from '@/types/tag';

interface Props {
  tags: Tag[];
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
}

export function TagsFilterDropdown({ tags, selectedTagIds, onToggle }: Props) {
  const { translate: t } = useTranslation();
  const label = selectedTagIds.length
    ? t('searchTab.filters.tagsLabelCount', { count: selectedTagIds.length })
    : t('searchTab.filters.tagsLabel');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DropdownTriggerButton active={selectedTagIds.length > 0}>{label}</DropdownTriggerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {tags.map((tag) => (
          <DropdownMenuCheckboxItem
            key={tag.id}
            checked={selectedTagIds.includes(tag.id)}
            onCheckedChange={() => onToggle(tag.id)}
            onSelect={(e) => e.preventDefault()}
          >
            <PaletteDot color={tag.color} />
            {tag.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
