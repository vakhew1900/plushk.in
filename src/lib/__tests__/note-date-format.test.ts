import { describe, expect, it } from 'vitest';
import { formatNoteDate, formatNoteTimestamp } from '../note-date-format';

// Noon UTC on a mid-month day so no real-world timezone offset can roll it
// over into an adjacent day/month — keeps the assertions timezone-safe.
const SAMPLE_ISO = '2026-08-15T12:00:00.000Z';

describe('formatNoteDate', () => {
  it('formats a day + short month in Russian', () => {
    expect(formatNoteDate(SAMPLE_ISO, 'ru')).toMatch(/15\s+авг/i);
  });

  it('formats a day + short month in English', () => {
    const result = formatNoteDate(SAMPLE_ISO, 'en');
    expect(result).toContain('15');
    expect(result).toMatch(/aug/i);
  });
});

describe('formatNoteTimestamp', () => {
  it('includes the date and a HH:MM time', () => {
    const result = formatNoteTimestamp(SAMPLE_ISO, 'ru');
    expect(result).toMatch(/15\s+авг/i);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});
