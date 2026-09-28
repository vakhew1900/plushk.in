import { clsx } from 'clsx';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import type { QuickAddStatus } from './quick-add-status';
import styles from './QuickAddSelectorField.module.css';

const TONE_CLASS: Record<QuickAddStatus, string> = {
  searching: styles.toneSearching,
  ok: styles.toneOk,
  empty: styles.toneEmpty,
};

interface QuickAddSelectorFieldProps {
  value: string;
  status: QuickAddStatus;
  onChange: (value: string) => void;
}

// Editable, not read-only — the auto-generated selector is a starting point,
// not the final word (see @medv/finder's own timeout/fallback caveats in
// lib/css-selector.ts). Editing re-runs the same match preview below, so a
// hand-narrowed selector gets the same green/red feedback as the generated one.
export function QuickAddSelectorField({ value, status, onChange }: QuickAddSelectorFieldProps) {
  const { translate: t } = useTranslation();

  return (
    <div>
      <label htmlFor="quickadd-selector" className={styles.label}>
        <Text as="span" size="caption" tone="muted">{t('quickAdd.selectorLabel')}</Text>
      </label>
      <Input
        id="quickadd-selector"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(styles.selectorInput, TONE_CLASS[status])}
      />
    </div>
  );
}
