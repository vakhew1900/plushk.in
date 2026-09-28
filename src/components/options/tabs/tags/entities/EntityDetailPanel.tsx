import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DetailField } from '@/components/ui/detail-field';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useEntityWorkflow } from '@/hooks/useEntityWorkflow';
import type { EntityType } from '@/types/entity-type';
import type { PaletteColor } from '@/types/palette-color';
import type { IconName } from '@/types/icon-name';
import { WorkflowStatusRow } from './WorkflowStatusRow';
import styles from './EntityDetailPanel.module.css';

interface Props {
  entity: EntityType;
  onNameChange: (name: string) => void;
  onColorChange: (color: PaletteColor) => void;
  onIconChange: (icon: IconName | undefined) => void;
  onRemove: () => void;
}

export function EntityDetailPanel({ entity, onNameChange, onColorChange, onIconChange, onRemove }: Props) {
  const { translate: t } = useTranslation();
  const { statuses, addStatus, renameStatus, recolorStatus, removeStatus } = useEntityWorkflow(entity.id);

  return (
    <div className={styles.panel}>
      <DetailField label={t('entityDetail.nameLabel')}>
        <div className={styles.nameRow}>
          <ColorPicker value={entity.color} onChange={onColorChange} />
          <IconPicker value={entity.icon} color={entity.color} onChange={onIconChange} />
          <Input
            value={entity.name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => { if (!entity.name.trim()) onRemove(); }}
            placeholder={t('entitiesSection.namePlaceholder')}
            className={styles.nameInput}
          />
          <RemoveIconButton onClick={onRemove} />
        </div>
      </DetailField>

      <DetailField label={t('entityDetail.workflowLabel')}>
        <div className={styles.statusTable}>
          {statuses.map((status) => (
            <WorkflowStatusRow
              key={status.id}
              name={status.name}
              color={status.color}
              onNameChange={(name) => void renameStatus(status.id, name)}
              onColorChange={(color) => void recolorStatus(status.id, color)}
              onRemove={() => void removeStatus(status.id)}
            />
          ))}
        </div>
        <Button
          variant="dashed"
          size="sm"
          className={styles.addStatus}
          onClick={() => void addStatus('')}
        >
          <IconPlus size="sm" />
          {t('entityDetail.addStatus')}
        </Button>
      </DetailField>
    </div>
  );
}
