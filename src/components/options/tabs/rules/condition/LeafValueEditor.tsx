import type { DraftLeafNode } from '@/lib/visitor/rule-draft';
import { RuleType } from '@/types/rule';
import { TermValueEditor } from './TermValueEditor';
import { TermsValueEditor } from './TermsValueEditor';
import { PatternValueEditor } from './PatternValueEditor';

interface Props {
  node: DraftLeafNode;
  onChange: (next: DraftLeafNode) => void;
}

// Dispatches to one of 3 value editors by leaf type (regex/wildcard share
// `PatternValueEditor` — same `field`+`pattern` shape). A lookup table keyed
// by `node.type` was tried first, but TS can't soundly narrow "component
// whose prop type matches this specific union member" through an object
// index — a `switch` gives the same one-`ConditionRow`-not-four-subclasses
// result while staying fully type-checked, no `as`/`any` needed.
export function LeafValueEditor({ node, onChange }: Props) {
  switch (node.type) {
    case RuleType.TERM:
      return <TermValueEditor node={node} onChange={onChange} />;
    case RuleType.TERMS:
      return <TermsValueEditor node={node} onChange={onChange} />;
    case RuleType.REGEX:
    case RuleType.WILDCARD:
      return <PatternValueEditor node={node} onChange={onChange} />;
  }
}
