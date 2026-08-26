import { useState } from 'react';
import { useBookmarkEntityEditor } from '@/hooks/useBookmarkEntityEditor';
import { useBookmarkTagEditor } from '@/hooks/useBookmarkTagEditor';
import { useBookmarkIcon } from '@/hooks/useBookmarkIcon';
import { useBookmarkDelete } from '@/hooks/useBookmarkDelete';
import { BookmarkFavicon, BookmarkFaviconSize } from './BookmarkFavicon';
import { TagPicker } from './tags/TagPicker';
import { EntitySegment } from './entity/EntitySegment';
import { StatusSegment } from './entity/StatusSegment';
import { BookmarkSettingsDialog } from './settings/BookmarkSettingsDialog';
import { BookmarkDeleteDialog } from './settings/BookmarkDeleteDialog';
import styles from './BookmarkCard.module.css';

interface Props {
  id: string;
  title: string;
  url: string;
  folderPath: string[];
  onClick: () => void;
  /** Called after this bookmark is deleted or moved (UI-16) — re-runs the parent's search/list so the row reflects the new state. */
  onChanged: () => void;
}

// Every piece of per-bookmark editable state (entity/status, tags, icon) is
// fetched exactly once here and threaded down as props to both the inline
// controls on the card face AND BookmarkSettingsDialog's panel — two
// independent hook calls for the same bookmarkId (one inline, one inside the
// dialog) would each hold their own stale local copy and never see each
// other's writes, same root cause as ARCH-12 (see useBookmarkIcon's docs for
// the icon case this was first found in).
export function BookmarkCard({ id, title, url, folderPath, onClick, onChanged }: Props) {
  const domain = new URL(url).hostname;
  const { entityTypes, selectedEntity, statuses, selectedStatus, chooseEntity, chooseStatus } =
    useBookmarkEntityEditor(id);
  const { tags, tagIds, toggleTag } = useBookmarkTagEditor(id);
  const { displayUrl, overrideUrl, setOverride } = useBookmarkIcon(id, url);
  const { remove } = useBookmarkDelete(id);
  const showStatus = Boolean(selectedEntity) && statuses.length > 0;

  const [deleteOpen, setDeleteOpen] = useState(false);
  const confirmDelete = async () => {
    await remove();
    setDeleteOpen(false);
    onChanged();
  };

  return (
    <div className={styles.card}>
      <BookmarkFavicon seed={domain} iconUrl={displayUrl} size={BookmarkFaviconSize.WIDE} />

      <div className={styles.content}>
        <div className={styles.headRow}>
          <div className={styles.meta}>
            <div className={styles.title} title={title} onClick={onClick} role="button" tabIndex={0}>
              {title}
            </div>
            <div className={styles.domain}>{domain}</div>
          </div>
          {entityTypes.length > 0 && (
            <EntitySegment
              entityTypes={entityTypes}
              selectedEntity={selectedEntity}
              onChoose={(entityTypeId) => void chooseEntity(entityTypeId)}
              colored
            />
          )}
        </div>

        <div className={styles.footRow}>
          <TagPicker tags={tags} selectedTagIds={tagIds} onToggle={(tagId) => void toggleTag(tagId)} />
          {showStatus && (
            <StatusSegment
              statuses={statuses}
              selectedStatus={selectedStatus}
              onChoose={(statusId) => void chooseStatus(statusId)}
            />
          )}
        </div>
      </div>

      <BookmarkSettingsDialog
        bookmarkId={id}
        seed={domain}
        url={url}
        folderPath={folderPath}
        displayUrl={displayUrl}
        overrideUrl={overrideUrl}
        onOverrideChange={setOverride}
        entityTypes={entityTypes}
        selectedEntity={selectedEntity}
        onChooseEntity={chooseEntity}
        statuses={statuses}
        selectedStatus={selectedStatus}
        onChooseStatus={chooseStatus}
        tags={tags}
        selectedTagIds={tagIds}
        onToggleTag={toggleTag}
        onRequestDelete={() => setDeleteOpen(true)}
        onMoved={onChanged}
      />
      <BookmarkDeleteDialog
        open={deleteOpen}
        title={title}
        onOpenChange={setDeleteOpen}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
