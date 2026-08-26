/** Short "26 авг"-style date for a note card footer, in the given UI locale. */
export function formatNoteDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(iso));
}

/** Longer "26 авг, 14:12"-style timestamp for the open-note detail view. */
export function formatNoteTimestamp(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
