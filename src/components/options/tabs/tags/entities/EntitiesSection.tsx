import { useState } from 'react';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useEntityTypes } from '@/hooks/useEntityTypes';
import { PaletteColor } from '@/types/palette-color';
import type { IconName } from '@/types/icon-name';
import { EntityList } from './EntityList';
import { EntityDetailPanel } from './EntityDetailPanel';
import styles from './EntitiesSection.module.css';

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
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <Text as="h2" size="subheading">{t('entitiesSection.title')}</Text>
      </div>
      <Text size="body" tone="muted" className={styles.sectionDesc}>{t('entitiesSection.desc')}</Text>

      <div className={styles.layout}>
        <EntityList
          entityTypes={entityTypes}
          selectedId={selected?.id}
          onSelect={setSelectedId}
          onAdd={addEntity}
        />
        {selected ? (
          <EntityDetailPanel
            entity={selected}
            onNameChange={(name) => renameEntity(selected.id, name)}
            onColorChange={(color) => recolorEntity(selected.id, color)}
            onIconChange={(icon) => reiconEntity(selected.id, icon)}
            onRemove={() => removeEntity(selected.id)}
          />
        ) : (
          <div className={styles.empty}>
            <Text size="body" tone="muted">{t('entitiesSection.noEntities')}</Text>
          </div>
        )}
      </div>
    </section>
  );
}
