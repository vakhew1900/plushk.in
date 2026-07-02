import { Badge } from '@/components/ui/badge';
import styles from './PopupPageCard.module.css';

export function PopupPageCard() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.siteRow}>
          <div className={styles.favicon}>r</div>
          <div className={styles.siteMeta}>
            <div className={styles.siteTitle}>r/webdev — Show your project</div>
            <div className={styles.siteDomain}>reddit.com · alias: reddit</div>
          </div>
        </div>

        <div className={styles.matchRow}>
          <div className={styles.matchLabel}>
            <span>Совпало правило</span>
            <Badge variant="accent">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12l4 4 10-10" />
              </svg>
              Соцсети
            </Badge>
          </div>

          <div className={styles.path}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--muted)" style={{ flexShrink: 0 }}>
              <path d="M3 6a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
            </svg>
            <span className={styles.pathMuted}>Bookmarks</span>
            <span className={styles.pathSep}>/</span>
            <span className={styles.pathMuted}>Соцсети</span>
            <span className={styles.pathSep}>/</span>
            <span className={styles.pathAccent}>Reddit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
