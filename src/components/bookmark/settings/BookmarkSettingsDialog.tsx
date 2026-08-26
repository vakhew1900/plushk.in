import { IconSettings } from '@/components/icons';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/useTranslation';
import type { EntityType } from '@/types/entity-type';
import type { WorkflowStatus } from '@/types/workflow-status';
import type { Tag } from '@/types/tag';
import { BookmarkSettingsPanel } from './BookmarkSettingsPanel';
import styles from './BookmarkSettingsDialog.module.css';

interface Props {
  bookmarkId: string;
  seed: string;
  url: string;
  folderPath: string[];
  displayUrl: string | undefined;
  overrideUrl: string | undefined;
  onOverrideChange: (value: string | undefined) => Promise<void>;
  entityTypes: EntityType[];
  selectedEntity: EntityType | undefined;
  onChooseEntity: (entityTypeId: string | undefined) => Promise<void>;
  statuses: WorkflowStatus[];
  selectedStatus: WorkflowStatus | undefined;
  onChooseStatus: (statusId: string) => Promise<void>;
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => Promise<void>;
}

/** Gear-icon rail on `BookmarkCard` opening the full bookmark settings dialog — see UI-15. */
export function BookmarkSettingsDialog(props: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.rail}>
      <Dialog>
        <DialogTrigger asChild>
          <button type="button" className={styles.trigger} title={t('bookmarkSettings.triggerTooltip')}>
            <IconSettings size="sm" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{t('bookmarkSettings.triggerTooltip')}</DialogTitle>
          <BookmarkSettingsPanel {...props} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
