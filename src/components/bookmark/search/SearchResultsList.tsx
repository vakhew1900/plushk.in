import { BookmarkCard } from '@/components/bookmark/BookmarkCard';
import type { BookmarkSearchEntry } from '@/types/bookmark-search-entry';
import { SearchEmptyState } from './SearchEmptyState';
import styles from './SearchResultsList.module.css';

interface Props {
  entries: BookmarkSearchEntry[];
  countLabel: string;
  emptyMessage: string;
  onOpen: (entry: BookmarkSearchEntry) => void;
}

export function SearchResultsList({ entries, countLabel, emptyMessage, onOpen }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.count}>{countLabel}</div>

      {entries.length === 0 ? (
        <SearchEmptyState message={emptyMessage} />
      ) : (
        <div className={styles.list}>
          {entries.map((entry) => (
            <BookmarkCard
              key={entry.id}
              title={entry.title}
              url={entry.url}
              folderPath={entry.folderPath}
              onClick={() => onOpen(entry)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
