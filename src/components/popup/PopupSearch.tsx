import { browser } from 'wxt/browser';
import { IconSearch } from '@/components/icons';
import { SearchBar } from '@/components/bookmark/search/SearchBar';
import { SearchResultsList } from '@/components/bookmark/search/SearchResultsList';
import { useBookmarkSearch } from '@/hooks/useBookmarkSearch';
import { useTranslation } from '@/hooks/useTranslation';
import type { BookmarkSearchEntry } from '@/types/bookmark-search-entry';
import styles from './PopupSearch.module.css';

export function PopupSearch() {
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
      <div className={styles.header}>
        <div className={styles.icon}>
          <IconSearch size={17} />
        </div>
        <div className={styles.title}>{t('nav.search')}</div>
      </div>

      <div className={styles.body}>
        <SearchBar value={query} onChange={setQuery} placeholder={t('searchTab.placeholder')} />

        {!loading && (
          <div className={styles.resultsScroll}>
            <SearchResultsList
              entries={results}
              countLabel={countLabel}
              emptyMessage={emptyMessage}
              onOpen={openBookmark}
            />
          </div>
        )}
      </div>
    </div>
  );
}
