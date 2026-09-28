import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { QuickAddSearchingRow } from './QuickAddSearchingRow';
import { QuickAddEmptyBox } from './QuickAddEmptyBox';
import { QuickAddIconThumbnail } from './QuickAddIconThumbnail';
import type { IconMatch } from './quick-add-match';
import styles from './QuickAddIconPreview.module.css';

interface QuickAddIconPreviewProps {
  match: IconMatch | undefined;
}

export function QuickAddIconPreview({ match }: QuickAddIconPreviewProps) {
  const { translate: t } = useTranslation();

  return (
    <div>
      <Text as="span" size="caption" tone="muted" className={styles.label}>{t('quickAdd.iconLabel')}</Text>

      {match === undefined && <QuickAddSearchingRow text={t('quickAdd.searchingIcon')} />}
      {match?.status === 'found' && <QuickAddIconThumbnail url={match.url} />}
      {match?.status === 'empty' && <QuickAddEmptyBox text={t('quickAdd.emptyIcon')} />}
    </div>
  );
}
