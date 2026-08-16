import { useMemo } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { collectSubtreeIds } from '@/lib/rule-tree';
import type { BookmarkRule } from '@/types/rule';
import type { RuleTreeNode } from '@/types/rule-tree';
import styles from './RuleDeleteDialog.module.css';

interface Props {
  node: RuleTreeNode | null;
  allRules: BookmarkRule[];
  onConfirm: (id: string) => void;
  onOpenChange: (open: boolean) => void;
}

export function RuleDeleteDialog({ node, allRules, onConfirm, onOpenChange }: Props) {
  const { translate: t } = useTranslation();

  // Hooks run unconditionally (before the `!node` bail below), so this is
  // skipped whenever `node`/`allRules` haven't actually changed since the
  // last render — not recomputed on every re-render of the tree while the
  // dialog just happens to be open.
  const descendantNames = useMemo(() => {
    if (!node) return [];
    const descendantIds = collectSubtreeIds(allRules, node.id).filter((id) => id !== node.id);
    return allRules.filter((r) => descendantIds.includes(r.id)).map((r) => `${r.name} → ${r.targetFolder || '—'}`);
  }, [node, allRules]);

  if (!node) return null;

  return (
    <AlertDialog open onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>{t('ruleTree.deleteDialogTitle', { name: node.rule.name })}</AlertDialogTitle>
        <AlertDialogDescription>
          {t('ruleTree.deleteDialogBody', { count: descendantNames.length })}
        </AlertDialogDescription>

        {descendantNames.length > 0 && (
          <ul className={styles.list}>
            {descendantNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <AlertDialogCancel asChild>
            <Button variant="outline" size="sm">{t('ruleTree.deleteDialogCancel')}</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" size="sm" onClick={() => onConfirm(node.id)}>
              {t('ruleTree.deleteDialogConfirm')}
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
