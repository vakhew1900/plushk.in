import { browser } from 'wxt/browser';
import { TabHeader } from '@/components/options/TabHeader';
import { BookmarkCard } from '@/components/bookmark/BookmarkCard';
import { useBookmarkSearch } from '@/hooks/useBookmarkSearch';
import { useTranslation } from '@/hooks/useTranslation';
import type { BookmarkSearchEntry } from '@/types/bookmark-search-entry';
import { SearchBar } from '@/components/bookmark/search/SearchBar';
import { SearchResultsList } from '@/components/bookmark/search/SearchResultsList';
import { BookmarkFiltersRow } from '@/components/bookmark/search/filters/BookmarkFiltersRow';
import styles from './LibraryTab.module.css';

export function LibraryTab() {
  const { translate: t } = useTranslation();
  const {
    query,
    setQuery,
    tagIds,
    toggleTagId,
    entityTypeId,
    setEntityTypeId,
    statusId,
    setStatusId,
    folderPath,
    setFolderPath,
    resetFilters,
    results,
    totalCount,
    refresh,
  } = useBookmarkSearch();

  const countLabel = query.trim()
    ? t('searchTab.foundCount', { count: results.length })
    : t('searchTab.allCount', { count: totalCount });

  const emptyMessage = query.trim() ? t('searchTab.noResults') : t('searchTab.noBookmarks');

  const openBookmark = (entry: BookmarkSearchEntry) => {
    void browser.tabs.create({ url: entry.url });
  };

  return (
    <div className={styles.wrap}>
      <TabHeader title={t('nav.library')} lead={t('searchTab.lead')} />

      <SearchBar value={query} onChange={setQuery} placeholder={t('searchTab.placeholder')} />

      <div className={styles.filtersRow}>
        <BookmarkFiltersRow
          tagIds={tagIds}
          toggleTagId={toggleTagId}
          entityTypeId={entityTypeId}
          setEntityTypeId={setEntityTypeId}
          statusId={statusId}
          setStatusId={setStatusId}
          folderPath={folderPath}
          setFolderPath={setFolderPath}
          resetFilters={resetFilters}
        />
      </div>

      <SearchResultsList
        entries={results}
        countLabel={countLabel}
        emptyMessage={emptyMessage}
        renderEntry={(entry) => (
          <BookmarkCard
            id={entry.id}
            title={entry.title}
            url={entry.url}
            folderPath={entry.folderPath}
            onClick={() => openBookmark(entry)}
            onChanged={refresh}
          />
        )}
      />
    </div>
  );
}
