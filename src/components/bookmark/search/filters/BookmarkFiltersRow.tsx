import { useEntityWorkflows } from '@/hooks/useEntityWorkflows';
import { useTags } from '@/hooks/useTags';
import { useTranslation } from '@/hooks/useTranslation';
import { TagsFilterDropdown } from './TagsFilterDropdown';
import { CategoryFilterDropdown } from './CategoryFilterDropdown';
import { StatusFilterDropdown } from './StatusFilterDropdown';
import { FolderFilterPopover } from './FolderFilterPopover';
import styles from './BookmarkFiltersRow.module.css';

interface Props {
  tagIds: string[];
  toggleTagId: (tagId: string) => void;
  entityTypeId: string | undefined;
  setEntityTypeId: (entityTypeId: string | undefined) => void;
  statusId: string | undefined;
  setStatusId: (statusId: string | undefined) => void;
  folderPath: string | undefined;
  setFolderPath: (folderPath: string | undefined) => void;
  resetFilters: () => void;
}

export function BookmarkFiltersRow({
  tagIds,
  toggleTagId,
  entityTypeId,
  setEntityTypeId,
  statusId,
  setStatusId,
  folderPath,
  setFolderPath,
  resetFilters,
}: Props) {
  const { translate: t } = useTranslation();
  const { items: tags } = useTags();
  const { entityTypes, statusesFor } = useEntityWorkflows();
  const statuses = statusesFor(entityTypeId);
  const hasActiveFilters = tagIds.length > 0 || Boolean(entityTypeId) || Boolean(statusId) || Boolean(folderPath);

  return (
    <div className={styles.row}>
      <TagsFilterDropdown tags={tags} selectedTagIds={tagIds} onToggle={toggleTagId} />
      <CategoryFilterDropdown entityTypes={entityTypes} selectedEntityTypeId={entityTypeId} onChange={setEntityTypeId} />

      <StatusFilterDropdown
        statuses={statuses}
        selectedStatusId={statusId}
        onChange={setStatusId}
        disabled={!entityTypeId}
      />

      <FolderFilterPopover folderPath={folderPath} onChange={setFolderPath} />

      {hasActiveFilters && (
        <button type="button" className={styles.reset} onClick={resetFilters}>
          {t('searchTab.filters.resetAll')}
        </button>
      )}
    </div>
  );
}
