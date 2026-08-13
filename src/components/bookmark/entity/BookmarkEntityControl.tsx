import type React from 'react';
import { useBookmarkEntityEditor } from '@/hooks/useBookmarkEntityEditor';
import { EntitySegment } from './EntitySegment';
import { StatusSegment } from './StatusSegment';
import styles from './BookmarkEntityControl.module.css';

interface Props {
  bookmarkId: string;
}

export function BookmarkEntityControl({ bookmarkId }: Props) {
  const { entityTypes, selectedEntity, statuses, selectedStatus, chooseEntity, chooseStatus } =
    useBookmarkEntityEditor(bookmarkId);

  if (entityTypes.length === 0) return null;

  const handleClick = (e: React.MouseEvent) => e.stopPropagation();
  const showStatus = Boolean(selectedEntity) && statuses.length > 0;

  return (
    <div className={styles.wrap} onClick={handleClick}>
      <EntitySegment
        entityTypes={entityTypes}
        selectedEntity={selectedEntity}
        standalone={!showStatus}
        onChoose={(id) => void chooseEntity(id)}
      />
      {showStatus && (
        <StatusSegment
          statuses={statuses}
          selectedStatus={selectedStatus}
          onChoose={(id) => void chooseStatus(id)}
        />
      )}
    </div>
  );
}
