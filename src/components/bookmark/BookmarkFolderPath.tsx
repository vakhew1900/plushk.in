import { Fragment } from 'react';
import { IconFolder } from '@/components/icons';
import styles from './BookmarkFolderPath.module.css';

interface Props {
  segments: string[];
}

export function BookmarkFolderPath({ segments }: Props) {
  if (segments.length === 0) return null;

  return (
    <div className={styles.path}>
      <IconFolder size={14} className={styles.icon} />
      {segments.map((segment, index) => (
        <Fragment key={index}>
          {index > 0 && <span className={styles.sep}>/</span>}
          <span className={index === segments.length - 1 ? styles.accent : styles.muted}>{segment}</span>
        </Fragment>
      ))}
    </div>
  );
}
