export const MimeType = {
  JSON: 'application/json',
  OCTET_STREAM: 'application/octet-stream',
} as const;
export type MimeType = typeof MimeType[keyof typeof MimeType];

/**
 * Delivers file content somewhere outside the extension's own storage.
 * `FileService` triggers a browser download; a future `ObsidianService`
 * (see EXPORT-1) could implement the same contract to write a note to an
 * Obsidian vault instead — callers depend only on this interface.
 */
export interface IFileService {
  save(filename: string, content: string, mimeType?: MimeType): Promise<void>;
}
