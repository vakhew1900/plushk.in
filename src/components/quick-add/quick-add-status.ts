export const QuickAddStatus = { SEARCHING: 'searching', OK: 'ok', EMPTY: 'empty' } as const;
export type QuickAddStatus = typeof QuickAddStatus[keyof typeof QuickAddStatus];
