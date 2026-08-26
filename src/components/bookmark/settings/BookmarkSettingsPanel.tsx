import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { EntitySegment } from '@/components/bookmark/entity/EntitySegment';
import { StatusSegment } from '@/components/bookmark/entity/StatusSegment';
import { TagPicker } from '@/components/bookmark/tags/TagPicker';
import { BookmarkFolderPath } from '@/components/bookmark/BookmarkFolderPath';
import { IconLink } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { EntityType } from '@/types/entity-type';
import type { WorkflowStatus } from '@/types/workflow-status';
import type { Tag } from '@/types/tag';
import { SettingsTabRail } from './SettingsTabRail';
import { BookmarkIconPreview } from './BookmarkIconPreview';
import styles from './BookmarkSettingsPanel.module.css';

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

export function BookmarkSettingsPanel({
  seed,
  url,
  folderPath,
  displayUrl,
  overrideUrl,
  onOverrideChange,
  entityTypes,
  selectedEntity,
  onChooseEntity,
  statuses,
  selectedStatus,
  onChooseStatus,
  tags,
  selectedTagIds,
  onToggleTag,
}: Props) {
  const { translate: t } = useTranslation();
  const iconInputRef = useRef<HTMLInputElement>(null);
  const showStatus = Boolean(selectedEntity) && statuses.length > 0;

  // Controlled, not defaultValue — overrideUrl loads asynchronously (useBookmarkIcon's
  // own effect, up in BookmarkCard), so the input must pick up the fetched value once
  // it lands after mount. Adjusted during render (same pattern as useQuickSaveSelection's
  // appliedSuggestion) rather than a useEffect+setState, which would cost an extra render pass.
  const [iconDraft, setIconDraft] = useState(overrideUrl ?? '');
  const [lastOverrideUrl, setLastOverrideUrl] = useState(overrideUrl);
  if (overrideUrl !== lastOverrideUrl) {
    setLastOverrideUrl(overrideUrl);
    setIconDraft(overrideUrl ?? '');
  }

  return (
    <div className={styles.panel}>
      <SettingsTabRail />

      <div className={styles.content}>
        <BookmarkIconPreview
          seed={seed}
          iconUrl={displayUrl}
          onEditClick={() => iconInputRef.current?.focus()}
        />

        <div className={styles.fields}>
          <div>
            <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
              {t('bookmarkSettings.iconLabel')}
            </Text>
            <Input
              ref={iconInputRef}
              value={iconDraft}
              placeholder={t('bookmarkSettings.iconPlaceholder')}
              onChange={(e) => setIconDraft(e.target.value)}
              onBlur={(e) => void onOverrideChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
              }}
            />
          </div>

          <div className={styles.row}>
            {entityTypes.length > 0 && (
              <div className={styles.half}>
                <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
                  {t('bookmarkSettings.categoryLabel')}
                </Text>
                <EntitySegment
                  entityTypes={entityTypes}
                  selectedEntity={selectedEntity}
                  onChoose={(entityTypeId) => void onChooseEntity(entityTypeId)}
                  colored
                />
              </div>
            )}
            {showStatus && (
              <div className={styles.half}>
                <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
                  {t('bookmarkSettings.statusLabel')}
                </Text>
                <StatusSegment
                  statuses={statuses}
                  selectedStatus={selectedStatus}
                  onChoose={(statusId) => void onChooseStatus(statusId)}
                />
              </div>
            )}
          </div>

          <div>
            <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
              {t('bookmarkSettings.tagsLabel')}
            </Text>
            <TagPicker tags={tags} selectedTagIds={selectedTagIds} onToggle={(tagId) => void onToggleTag(tagId)} />
          </div>

          <div>
            <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
              {t('bookmarkSettings.locationLabel')}
            </Text>
            <div className={styles.location}>
              <BookmarkFolderPath segments={folderPath} />
              <div className={styles.urlRow}>
                <IconLink size="sm" className={styles.urlIcon} />
                <span className={styles.url}>{url.replace(/^https?:\/\//, '')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
