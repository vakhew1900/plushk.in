import { browser } from 'wxt/browser';
import { TabHeader } from '@/components/options/TabHeader';
import { useBookmarkSearch } from '@/hooks/useBookmarkSearch';
import { useTranslation } from '@/hooks/useTranslation';
import type { BookmarkSearchEntry } from '@/types/bookmark-search-entry';
import { SearchBar } from '@/components/bookmark/search/SearchBar';
import { SearchResultsList } from '@/components/bookmark/search/SearchResultsList';
import styles from './SearchTab.module.css';

export function SearchTab() {
  const { translate: t } = useTranslation();
  const { query, setQuery, results, totalCount, loading } = useBookmarkSearch();

  const countLabel = query.trim()
    ? t('searchTab.foundCount', { count: results.length })
    : t('searchTab.allCount', { count: totalCount });

  const emptyMessage = query.trim() ? t('searchTab.noResults') : t('searchTab.noBookmarks');

  const openBookmark = (entry: BookmarkSearchEntry) => {
    browser.tabs.create({ url: entry.url });
  };

  return (
    <div className={styles.wrap}>
      <TabHeader title={t('nav.search')} lead={t('searchTab.lead')} />

      <SearchBar value={query} onChange={setQuery} placeholder={t('searchTab.placeholder')} />

      {!loading && (
        <SearchResultsList
          entries={results}
          countLabel={countLabel}
          emptyMessage={emptyMessage}
          onOpen={openBookmark}
        />
      )}
    </div>
  );
}
