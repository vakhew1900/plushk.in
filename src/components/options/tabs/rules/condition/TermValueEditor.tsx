import { Input } from '@/components/ui/input';
import type { DraftTermRule } from '@/lib/visitor/rule-draft';
import styles from './TermValueEditor.module.css';

interface Props {
  node: DraftTermRule;
  onChange: (next: DraftTermRule) => void;
}

export function TermValueEditor({ node, onChange }: Props) {
  return (
    <Input
      value={node.value}
      onChange={(e) => onChange({ ...node, value: e.target.value })}
      className={styles.input}
    />
  );
}
