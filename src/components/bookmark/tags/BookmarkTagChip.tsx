import { PaletteDot } from '@/components/ui/palette-dot';
import type { Tag } from '@/types/tag';
import styles from './BookmarkTagChip.module.css';

interface Props {
  tag: Tag;
}

export function BookmarkTagChip({ tag }: Props) {
  return (
    <span className={styles.chip}>
      <PaletteDot color={tag.color} />
      <span className={styles.label} title={tag.name}>{tag.name}</span>
    </span>
  );
}
