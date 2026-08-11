import type { CSSProperties } from 'react';
import type { Tag } from '@/types/tag';
import styles from './BookmarkTagChip.module.css';

interface Props {
  tag: Tag;
}

export function BookmarkTagChip({ tag }: Props) {
  const style = { '--dot-color': `var(--tag-${tag.color})` } as CSSProperties;

  return (
    <span className={styles.chip} style={style}>
      <span className={styles.dot} />
      {tag.name}
    </span>
  );
}
