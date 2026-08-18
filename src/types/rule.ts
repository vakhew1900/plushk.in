export const RuleType = {
  AND: "and",
  OR: "or",
  NOT: "not",
  TERM: "term",
  TERMS: "terms",
  REGEX: "regex",
  WILDCARD: "wildcard",
} as const;

export type RuleType = (typeof RuleType)[keyof typeof RuleType];

// ---

interface BaseRule {
  readonly type: RuleType;
}

// Compound rules — contain arrays of sub-rules

export interface AndRule extends BaseRule {
  readonly type: typeof RuleType.AND;
  readonly nodes: RuleNode[];
}

export interface OrRule extends BaseRule {
  readonly type: typeof RuleType.OR;
  readonly nodes: RuleNode[];
}

export interface NotRule extends BaseRule {
  readonly type: typeof RuleType.NOT;
  readonly nodes: RuleNode[];
}

// Leaf rules — match a single PageMeta field

export interface TermRule extends BaseRule {
  readonly type: typeof RuleType.TERM;
  readonly field: string;
  readonly value: string;
}

export interface TermsRule extends BaseRule {
  readonly type: typeof RuleType.TERMS;
  readonly field: string;
  readonly values: string[];
}

export interface RegexRule extends BaseRule {
  readonly type: typeof RuleType.REGEX;
  readonly field: string;
  readonly pattern: string;
}

export interface WildcardRule extends BaseRule {
  readonly type: typeof RuleType.WILDCARD;
  readonly field: string;
  readonly pattern: string;
}

// Union — the type used everywhere in function signatures
export type RuleNode =
  | AndRule
  | OrRule
  | NotRule
  | TermRule
  | TermsRule
  | RegexRule
  | WildcardRule;

// Type guards

export const isCompoundRule = (
  rule: RuleNode,
): rule is AndRule | OrRule | NotRule =>
  rule.type === RuleType.AND ||
  rule.type === RuleType.OR ||
  rule.type === RuleType.NOT;

export const isLeafRule = (
  rule: RuleNode,
): rule is TermRule | TermsRule | RegexRule | WildcardRule =>
  !isCompoundRule(rule);

// A bookmark rule: wraps the DSL condition with metadata
export interface BookmarkRule {
  readonly id: string;
  readonly name: string;
  readonly desc?: string;
  readonly condition: RuleNode;
  readonly targetFolder: string;
  readonly tagIds?: string[];
  readonly entityTypeId?: string;
  readonly statusId?: string;
  readonly priority: number;
  readonly enabled: boolean;
  /** Parent rule id — absent means top-level (child of the virtual default-folder root). See RULE-10. */
  readonly parentId?: string;
}

export const BookmarkRuleField = {
  ID: "id",
  NAME: "name",
  DESC: "desc",
  CONDITION: "condition",
  TARGET_FOLDER: "targetFolder",
  TAG_IDS: "tagIds",
  ENTITY_TYPE_ID: "entityTypeId",
  STATUS_ID: "statusId",
  PRIORITY: "priority",
  ENABLED: "enabled",
  PARENT_ID: "parentId",
} as const;
export type BookmarkRuleField =
  (typeof BookmarkRuleField)[keyof typeof BookmarkRuleField];
