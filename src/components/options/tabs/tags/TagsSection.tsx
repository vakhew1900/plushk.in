import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useTags } from '@/hooks/useTags';
import { PaletteColor } from '@/types/palette-color';
import { PaletteDot } from '@/components/ui/palette-dot';
import { ListDetailSection } from '@/components/options/list-detail/ListDetailSection';
import { TagDetailPanel } from './TagDetailPanel';

export function TagsSection() {
  const { translate: t } = useTranslation();
  const { items: tags, save, remove } = useTags();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const selected = tags.find((tag) => tag.id === selectedId) ?? tags[0];

  const addTag = () => {
    const tag = { id: crypto.randomUUID(), name: '', color: PaletteColor.RED };
    void save(tag);
    setSelectedId(tag.id);
  };

  const renameTag = (id: string, name: string) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) void save({ ...tag, name });
  };

  const recolorTag = (id: string, color: PaletteColor) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) void save({ ...tag, color });
  };

  const removeTag = (id: string) => {
    void remove(id);
    if (selected?.id === id) setSelectedId(undefined);
  };

  return (
    <ListDetailSection
      title={t('tagsSection.title')}
      desc={t('tagsSection.desc')}
      items={tags}
      getId={(tag) => tag.id}
      getName={(tag) => tag.name || t('tagsSection.namePlaceholder')}
      renderLeading={(tag) => <PaletteDot color={tag.color} />}
      selectedId={selected?.id}
      onSelect={setSelectedId}
      onAdd={addTag}
      addLabel={t('common.add')}
      searchPlaceholder={t('common.searchPlaceholder')}
      noResultsLabel={t('common.noSearchResults')}
      emptyLabel={t('tagsSection.noTags')}
    >
      {selected && (
        <TagDetailPanel
          name={selected.name}
          color={selected.color}
          onNameChange={(name) => renameTag(selected.id, name)}
          onColorChange={(color) => recolorTag(selected.id, color)}
          onRemove={() => removeTag(selected.id)}
        />
      )}
    </ListDetailSection>
  );
}
