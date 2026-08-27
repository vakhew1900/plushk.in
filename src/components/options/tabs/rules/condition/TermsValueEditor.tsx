import { useLayoutEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Input } from '@/components/ui/input';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { IconPlus } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { DraftTermsRule } from '@/lib/visitor/rule-draft';
import styles from './TermsValueEditor.module.css';

interface Props {
  node: DraftTermsRule;
  onChange: (next: DraftTermsRule) => void;
}

export function TermsValueEditor({ node, onChange }: Props) {
  const { translate: t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  // The right-edge fade only makes sense once the chip strip actually
  // overflows — applying it unconditionally would clip the last chip/the
  // "add value" button on short lists that fit with room to spare.
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const checkOverflow = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [node.values.length]);

  const setValues = (values: string[]) => onChange({ ...node, values });

  return (
    <div ref={trackRef} className={clsx(styles.chips, overflowing && styles.fade)}>
      {node.values.map((v, i) => (
        <div key={i} className={styles.chip}>
          <Input
            value={v}
            onChange={(e) => setValues(node.values.map((x, j) => (j === i ? e.target.value : x)))}
            className={styles.chipInput}
          />
          <RemoveIconButton
            onClick={() => setValues(node.values.filter((_, j) => j !== i))}
            aria-label={t('conditionRow.removeValue')}
          />
        </div>
      ))}
      <button onClick={() => setValues([...node.values, ''])} className={styles.addChip}>
        <IconPlus size="sm" />
        {t('conditionRow.addValue')}
      </button>
    </div>
  );
}
