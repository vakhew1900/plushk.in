import { ColorPicker } from '@/components/ui/color-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconX, IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useEntityWorkflow } from '@/hooks/useEntityWorkflow';
import type { EntityType } from '@/types/entity-type';
import type { PaletteColor } from '@/types/palette-color';
import { WorkflowStatusRow } from './WorkflowStatusRow';
import styles from './EntityDetailPanel.module.css';

interface Props {
  entity: EntityType;
  onNameChange: (name: string) => void;
  onColorChange: (color: PaletteColor) => void;
  onRemove: () => void;
}

export function EntityDetailPanel({ entity, onNameChange, onColorChange, onRemove }: Props) {
  const { translate: t } = useTranslation();
  const { statuses, addStatus, renameStatus, recolorStatus, removeStatus } = useEntityWorkflow(entity.id);

  return (
    <div className={styles.panel}>
      <div className={styles.field}>
        <span className={styles.label}>{t('entityDetail.colorLabel')}</span>
        <ColorPicker value={entity.color} onChange={onColorChange} />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{t('entityDetail.nameLabel')}</span>
        <div className={styles.nameRow}>
          <Input
            value={entity.name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => { if (!entity.name.trim()) onRemove(); }}
            placeholder={t('entitiesSection.namePlaceholder')}
            className={styles.nameInput}
          />
          <button type="button" className={styles.removeEntity} onClick={onRemove}>
            <IconX size="sm" />
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{t('entityDetail.iconLabel')}</span>
        <div className={styles.iconRow}>
          <span className={styles.iconSlot}>
            <IconPlus size="sm" />
          </span>
          <span className={styles.iconComingSoon}>{t('entityDetail.iconComingSoon')}</span>
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{t('entityDetail.workflowLabel')}</span>
        <div className={styles.statusTable}>
          {statuses.map((status) => (
            <WorkflowStatusRow
              key={status.id}
              name={status.name}
              color={status.color}
              isStart={status.order === 0}
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
      </div>
    </div>
  );
}
