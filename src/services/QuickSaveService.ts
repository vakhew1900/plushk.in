import { browser } from 'wxt/browser';
import { QuickSaveMessageType } from '../types/messages/quick-save-message';
import type { QuickSaveMessage } from '../types/messages/quick-save-message';
import type { IQuickSaveService, QuickSaveInput } from './interfaces/IQuickSaveService';

export class QuickSaveService implements IQuickSaveService {
  async create(input: QuickSaveInput): Promise<void> {
    const message: QuickSaveMessage = { type: QuickSaveMessageType.CREATE, ...input };
    await browser.runtime.sendMessage(message);
  }
}
