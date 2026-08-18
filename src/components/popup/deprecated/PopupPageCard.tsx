import { Badge } from '@/components/ui/badge';
import { IconCheck } from '@/components/icons';
import { BookmarkFavicon } from '@/components/bookmark/BookmarkFavicon';
import { BookmarkFolderPath } from '@/components/bookmark/BookmarkFolderPath';
import styles from './PopupPageCard.module.css';

/** @deprecated Dropped from SettingsView (App.tsx) — kept for reference, may be revisited later. */
export function PopupPageCard() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.siteRow}>
          <BookmarkFavicon seed="reddit.com" />
          <div className={styles.siteMeta}>
            <div className={styles.siteTitle}>r/webdev — Show your project</div>
            <div className={styles.siteDomain}>reddit.com · alias: reddit</div>
          </div>
        </div>

        <div className={styles.matchRow}>
          <div className={styles.matchLabel}>
            <span>Совпало правило</span>
            <Badge variant="accent">
              <IconCheck size="sm" />
              Соцсети
            </Badge>
          </div>

          <BookmarkFolderPath segments={['Bookmarks', 'Соцсети', 'Reddit']} />
        </div>
      </div>
    </div>
  );
}
