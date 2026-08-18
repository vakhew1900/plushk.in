import { Input } from '@/components/ui/input';
import type { DraftRegexRule, DraftWildcardRule } from '@/lib/visitor/rule-draft';
import styles from './PatternValueEditor.module.css';

interface Props {
  node: DraftRegexRule | DraftWildcardRule;
  onChange: (next: DraftRegexRule | DraftWildcardRule) => void;
}

export function PatternValueEditor({ node, onChange }: Props) {
  return (
    <Input
      value={node.pattern}
      onChange={(e) => onChange({ ...node, pattern: e.target.value })}
      className={styles.input}
    />
  );
}
