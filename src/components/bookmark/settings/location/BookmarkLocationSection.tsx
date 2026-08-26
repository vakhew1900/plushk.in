import { useState } from 'react';
import { useBookmarkMove } from '@/hooks/useBookmarkMove';
import { BookmarkLocationView } from './BookmarkLocationView';
import { BookmarkLocationEditor } from './BookmarkLocationEditor';
import styles from './BookmarkLocationSection.module.css';

interface Props {
  bookmarkId: string;
  folderPath: string[];
  url: string;
  onRequestDelete: () => void;
  onMoved: () => void;
}

/** The settings panel's "Location" field — read-only path/url by default, expands in place into a `FolderTree` picker for UI-16's move flow. Also hosts the delete-bookmark trigger, contextually next to the path it deletes. */
export function BookmarkLocationSection({ bookmarkId, folderPath, url, onRequestDelete, onMoved }: Props) {
  const { moveTo } = useBookmarkMove(bookmarkId);
  const [isEditing, setIsEditing] = useState(false);
  const [draftPath, setDraftPath] = useState('');

  const startEditing = () => {
    setDraftPath(folderPath.join('/'));
    setIsEditing(true);
  };

  const handleMove = async () => {
    await moveTo(draftPath);
    setIsEditing(false);
    onMoved();
  };

  return (
    <div className={styles.wrap}>
      {isEditing ? (
        <BookmarkLocationEditor
          draftPath={draftPath}
          onDraftPathChange={setDraftPath}
          onCancel={() => setIsEditing(false)}
          onMove={() => void handleMove()}
        />
      ) : (
        <BookmarkLocationView
          folderPath={folderPath}
          url={url}
          onEdit={startEditing}
          onRequestDelete={onRequestDelete}
        />
      )}
    </div>
  );
}
