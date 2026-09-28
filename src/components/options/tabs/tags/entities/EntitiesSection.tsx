import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useEntityTypes } from '@/hooks/useEntityTypes';
import { PaletteColor } from '@/types/palette-color';
import { PaletteIconDot } from '@/components/ui/palette-icon-dot';
import type { IconName } from '@/types/icon-name';
import { ListDetailSection } from '@/components/options/list-detail/ListDetailSection';
import { EntityDetailPanel } from './EntityDetailPanel';

export function EntitiesSection() {
  const { translate: t } = useTranslation();
  const { items: entityTypes, save, remove } = useEntityTypes();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const selected = entityTypes.find((e) => e.id === selectedId) ?? entityTypes[0];

  const addEntity = () => {
    const entity = { id: crypto.randomUUID(), name: '', color: PaletteColor.RED };
    void save(entity);
    setSelectedId(entity.id);
  };

  const renameEntity = (id: string, name: string) => {
    const entity = entityTypes.find((e) => e.id === id);
    if (entity) void save({ ...entity, name });
  };

  const recolorEntity = (id: string, color: PaletteColor) => {
    const entity = entityTypes.find((e) => e.id === id);
    if (entity) void save({ ...entity, color });
  };

  const reiconEntity = (id: string, icon: IconName | undefined) => {
    const entity = entityTypes.find((e) => e.id === id);
    if (entity) void save({ ...entity, icon });
  };

  const removeEntity = (id: string) => {
    void remove(id);
    if (selected?.id === id) setSelectedId(undefined);
  };

  return (
    <ListDetailSection
      title={t('entitiesSection.title')}
      desc={t('entitiesSection.desc')}
      items={entityTypes}
      getId={(e) => e.id}
      getName={(e) => e.name || t('entitiesSection.namePlaceholder')}
      renderLeading={(e) => <PaletteIconDot color={e.color} icon={e.icon} />}
      selectedId={selected?.id}
      onSelect={setSelectedId}
      onAdd={addEntity}
      addLabel={t('common.add')}
      searchPlaceholder={t('common.searchPlaceholder')}
      noResultsLabel={t('common.noSearchResults')}
      emptyLabel={t('entitiesSection.noEntities')}
    >
      {selected && (
        <EntityDetailPanel
          entity={selected}
          onNameChange={(name) => renameEntity(selected.id, name)}
          onColorChange={(color) => recolorEntity(selected.id, color)}
          onIconChange={(icon) => reiconEntity(selected.id, icon)}
          onRemove={() => removeEntity(selected.id)}
        />
      )}
    </ListDetailSection>
  );
}
