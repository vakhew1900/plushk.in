// RULE-14: two message kinds, both between background.ts (has contextMenus/
// tabs, but no DOM) and quick-add.content.ts (has the DOM, but must ask
// background to write to Dexie — a content script's IndexedDB is the *page's*
// origin, not chrome-extension://, see specs/tasks/RULE-14-context-menu-quick-add).

export const QuickAddKind = { VARIABLE: 'variable', ICON: 'icon' } as const;
export type QuickAddKind = typeof QuickAddKind[keyof typeof QuickAddKind];

// `typeof` result, used by both type guards below to check message is a
// plain object before reading its `type` field.
const JsTypeofResult = { OBJECT: 'object' } as const;

// background.ts -> content script, right after a context-menu item is
// clicked: "open the panel for the element you already cached on contextmenu".
export const QuickAddOpenMessageType = 'quickAdd/open';

export interface QuickAddOpenMessage {
  type: typeof QuickAddOpenMessageType;
  kind: QuickAddKind;
}

export function isQuickAddOpenMessage(message: unknown): message is QuickAddOpenMessage {
  return (
    typeof message === JsTypeofResult.OBJECT &&
    message !== null &&
    (message as Record<string, unknown>).type === QuickAddOpenMessageType
  );
}

// content script -> background.ts, on Save: everything needed to write a
// PageMatch (kind: 'variable') or an IconRule (kind: 'icon').
export const QuickAddSaveMessageType = 'quickAdd/save';

export interface QuickAddSaveMessage {
  type: typeof QuickAddSaveMessageType;
  kind: QuickAddKind;
  domain: string;
  name: string;
  selector: string;
}

export function isQuickAddSaveMessage(message: unknown): message is QuickAddSaveMessage {
  return (
    typeof message === JsTypeofResult.OBJECT &&
    message !== null &&
    (message as Record<string, unknown>).type === QuickAddSaveMessageType
  );
}

export const QuickAddSaveErrorType = { DUPLICATE_NAME: 'duplicate-name' } as const;
export type QuickAddSaveErrorType = typeof QuickAddSaveErrorType[keyof typeof QuickAddSaveErrorType];

export type QuickAddSaveResult = { ok: true } | { ok: false; error: QuickAddSaveErrorType };
