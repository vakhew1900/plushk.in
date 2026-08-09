import type { ReactNode } from 'react';
import type { BookmarkSearchEntry } from '@/types/bookmark-search-entry';
import { SearchEmptyState } from './SearchEmptyState';
import styles from './SearchResultsList.module.css';

interface Props {
  entries: BookmarkSearchEntry[];
  countLabel: string;
  emptyMessage: string;
  renderEntry: (entry: BookmarkSearchEntry) => ReactNode;
}

export function SearchResultsList({ entries, countLabel, emptyMessage, renderEntry }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.count}>{countLabel}</div>

      {entries.length === 0 ? (
        <SearchEmptyState message={emptyMessage} />
      ) : (
        <div className={styles.list}>
          {entries.map((entry) => (
            <div key={entry.id}>{renderEntry(entry)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
