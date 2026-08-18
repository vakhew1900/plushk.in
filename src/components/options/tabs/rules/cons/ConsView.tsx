import { useEffect, useRef, useState } from 'react';
import type { RuleNode } from '@/types/rule';
import type { DraftRuleNode } from '@/lib/visitor/rule-draft';
import { fromDraftNode, isDraftGroup, toDraftNode } from '@/lib/visitor/rule-draft';
import { ConditionGroup } from '../condition/ConditionGroup';
import { ConditionRow } from '../condition/ConditionRow';
import styles from './ConsView.module.css';

interface Props {
  value: RuleNode;
  onChange: (rule: RuleNode) => void;
}

// Root of the visual condition builder. Owns the id-decorated draft tree;
// `value`/`onChange` are the plain `RuleNode` the rest of the app sees
// (`RuleEditor` keeps `JsonView` in sync with the same prop).
export function ConsView({ value, onChange }: Props) {
  const [draft, setDraft] = useState<DraftRuleNode>(() => toDraftNode(value));

  // Compares serialized content, not object identity: `value` goes through
  // JSON.stringify/parseRuleNode on its way back from `JsonView`, so even an
  // edit `ConsView` itself just emitted arrives as a new (but equal) object.
  // Resyncing on that would regenerate every id and reset focus/keys on
  // every keystroke — only resync when the content actually differs.
  const lastEmittedJson = useRef(JSON.stringify(value));

  useEffect(() => {
    const incoming = JSON.stringify(value);
    if (incoming !== lastEmittedJson.current) {
      setDraft(toDraftNode(value));
      lastEmittedJson.current = incoming;
    }
  }, [value]);

  const emit = (next: DraftRuleNode) => {
    setDraft(next);
    const rule = fromDraftNode(next);
    lastEmittedJson.current = JSON.stringify(rule);
    onChange(rule);
  };

  return (
    <div className={styles.wrap}>
      {isDraftGroup(draft) ? (
        <ConditionGroup node={draft} onChange={emit} />
      ) : (
        <ConditionRow node={draft} onChange={emit} />
      )}
    </div>
  );
}
