export const PopupScreen = { QUICK_SAVE: 'quickSave', SEARCH: 'search' } as const;
export type PopupScreen = typeof PopupScreen[keyof typeof PopupScreen];
