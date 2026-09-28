import { useState } from 'react';
import { IconImage } from '@/components/icons';
import { Text } from '@/components/ui/text';
import styles from './QuickAddIconThumbnail.module.css';

interface QuickAddIconThumbnailProps {
  url: string;
}

// Falls back to a generic glyph on a broken/blocked URL (404, CORS, ...) —
// same pattern as the popup's IconField, which was missing here before.
export function QuickAddIconThumbnail({ url }: QuickAddIconThumbnailProps) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={styles.row}>
      <div className={styles.thumbnail}>
        {broken ? <IconImage size="sm" /> : <img src={url} alt="" onError={() => setBroken(true)} />}
      </div>
      <Text size="code" className={styles.urlText}>{url}</Text>
    </div>
  );
}
