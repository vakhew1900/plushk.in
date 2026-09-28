// Result of running the already-built selector against the live page —
// computed client-side in QuickAddPanel (the content script has real DOM
// access; see lib/page-extractor.ts's applyCssSelector / lib/icon-extractor.ts's
// applyIconSelector, both reused as-is here).

export type VariableMatch =
  | { status: 'single'; values: [string] }
  | { status: 'multiple'; values: string[] }
  | { status: 'empty'; values: [] };

export type IconMatch =
  | { status: 'found'; url: string }
  | { status: 'empty' };
