import { Button } from '@/components/ui/button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { EntityType } from '@/types/entity-type';
import { EntityListRow } from './EntityListRow';
import styles from './EntityList.module.css';

interface Props {
  entityTypes: EntityType[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function EntityList({ entityTypes, selectedId, onSelect, onAdd }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.list}>
      {entityTypes.map((entity) => (
        <EntityListRow
          key={entity.id}
          entity={entity}
          selected={entity.id === selectedId}
          onSelect={() => onSelect(entity.id)}
        />
      ))}
      <Button variant="outline" size="sm" className={styles.addButton} onClick={onAdd}>
        <IconPlus size="sm" />
        {t('entitiesSection.addEntity')}
      </Button>
    </div>
  );
}
