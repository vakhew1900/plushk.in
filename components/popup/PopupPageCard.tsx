import { Badge } from '@/components/ui/badge';
import { IconCheck, IconFolder } from '@/components/icons';
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
              <IconCheck size={11} />
              Соцсети
            </Badge>
          </div>

          <div className={styles.path}>
            <IconFolder size={14} fill="var(--muted)" style={{ flexShrink: 0 }} />
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
