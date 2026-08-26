import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { EntitySegment } from '@/components/bookmark/entity/EntitySegment';
import { StatusSegment } from '@/components/bookmark/entity/StatusSegment';
import { BookmarkTagList } from '@/components/bookmark/tags/BookmarkTagList';
import { useBookmarkEntityEditor } from '@/hooks/useBookmarkEntityEditor';
import { useIconBookmarkOverride } from '@/hooks/useIconBookmarkOverride';
import { useTranslation } from '@/hooks/useTranslation';
import { SettingsTabRail } from './SettingsTabRail';
import { BookmarkIconPreview } from './BookmarkIconPreview';
import styles from './BookmarkSettingsPanel.module.css';

interface Props {
  bookmarkId: string;
  url: string;
  seed: string;
}

export function BookmarkSettingsPanel({ bookmarkId, url, seed }: Props) {
  const { translate: t } = useTranslation();
  const { entityTypes, selectedEntity, statuses, selectedStatus, chooseEntity, chooseStatus } =
    useBookmarkEntityEditor(bookmarkId);
  const { iconUrl, setIconUrl } = useIconBookmarkOverride(bookmarkId);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const showStatus = Boolean(selectedEntity) && statuses.length > 0;

  // Controlled, not defaultValue — iconUrl loads asynchronously (useIconBookmarkOverride's
  // own effect), so the input must pick up the fetched value once it lands after mount.
  // Adjusted during render (same pattern as useQuickSaveSelection's appliedSuggestion)
  // rather than a useEffect+setState, which would cost an extra render pass.
  const [iconDraft, setIconDraft] = useState(iconUrl ?? '');
  const [lastIconUrl, setLastIconUrl] = useState(iconUrl);
  if (iconUrl !== lastIconUrl) {
    setLastIconUrl(iconUrl);
    setIconDraft(iconUrl ?? '');
  }

  return (
    <div className={styles.panel}>
      <SettingsTabRail />

      <div className={styles.content}>
        <BookmarkIconPreview
          seed={seed}
          url={url}
          bookmarkId={bookmarkId}
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
              onBlur={(e) => void setIconUrl(e.target.value)}
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
                  onChoose={(entityTypeId) => void chooseEntity(entityTypeId)}
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
                  onChoose={(statusId) => void chooseStatus(statusId)}
                />
              </div>
            )}
          </div>

          <div>
            <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
              {t('bookmarkSettings.tagsLabel')}
            </Text>
            <BookmarkTagList bookmarkId={bookmarkId} />
          </div>
        </div>
      </div>
    </div>
  );
}
