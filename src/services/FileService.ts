import { MimeType } from './interfaces/IFileService';
import type { IFileService } from './interfaces/IFileService';

/**
 * Saves file content via a browser download (Blob + <a download>). Runs only
 * in contexts with a DOM (e.g. the options page) — not the service worker.
 */
export class FileService implements IFileService {
  async save(filename: string, content: string, mimeType: MimeType = MimeType.OCTET_STREAM): Promise<void> {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}
