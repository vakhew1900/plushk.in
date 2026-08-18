import { RuleType } from '@/types/rule';
import type { LeafRuleType } from '@/lib/visitor/rule-draft';
import type { TranslationKey } from '@/locale';

interface LeafLabels {
  opLabelKey: TranslationKey;
  addLabelKey: TranslationKey;
}

export const LEAF_LABELS: Record<LeafRuleType, LeafLabels> = {
  [RuleType.TERM]: { opLabelKey: 'leafType.term', addLabelKey: 'leafType.addTerm' },
  [RuleType.TERMS]: { opLabelKey: 'leafType.terms', addLabelKey: 'leafType.addTerms' },
  [RuleType.REGEX]: { opLabelKey: 'leafType.regex', addLabelKey: 'leafType.addRegex' },
  [RuleType.WILDCARD]: { opLabelKey: 'leafType.wildcard', addLabelKey: 'leafType.addWildcard' },
};

export const LEAF_TYPES: LeafRuleType[] = [RuleType.TERM, RuleType.TERMS, RuleType.REGEX, RuleType.WILDCARD];
