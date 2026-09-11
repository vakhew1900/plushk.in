import { clsx } from 'clsx';
import { IconArrowLeft, IconArrowRight } from '@/components/icons';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { getPageItems, type PageItem } from '@/lib/pagination';
import styles from './Pagination.module.css';

interface PageItemButtonProps {
  item: PageItem;
  page: number;
  onPageChange: (page: number) => void;
}

// One entry of the page-number strip: either a "…" gap, or a clickable page
// number — kept local to Pagination.tsx, it has no use outside this strip.
function PageItemButton({ item, page, onPageChange }: PageItemButtonProps) {
  if (item === null) {
    return (
      <Text as="span" size="caption" tone="muted" className={styles.ellipsis}>
        …
      </Text>
    );
  }

  return (
    <button
      type="button"
      className={clsx(styles.pageButton, item === page && styles.active)}
      onClick={() => onPageChange(item)}
      aria-current={item === page ? 'page' : undefined}
    >
      <Text as="span" size="caption" tone={item === page ? 'accent' : 'muted'}>
        {item + 1}
      </Text>
    </button>
  );
}

interface Props {
  /** 0-based current page. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onPageChange }: Props) {
  const { translate: t } = useTranslation();

  if (pageCount <= 1) return null;

  return (
    <nav className={styles.wrap} aria-label={t('searchTab.pagination.nav')}>
      <IconButton
        icon={IconArrowLeft}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label={t('searchTab.pagination.prev')}
      />

      {getPageItems(page, pageCount).map((item, index) => (
        <PageItemButton key={item ?? `gap-${index}`} item={item} page={page} onPageChange={onPageChange} />
      ))}

      <IconButton
        icon={IconArrowRight}
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount - 1}
        aria-label={t('searchTab.pagination.next')}
      />
    </nav>
  );
}
