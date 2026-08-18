import type { WxtStorageItem } from 'wxt/utils/storage';

export abstract class StorageItemRepository<T, TMeta extends Record<string, unknown> = Record<string, never>> {
  constructor(protected readonly item: WxtStorageItem<T, TMeta>) {}

  async get(): Promise<T> {
    return this.item.getValue();
  }

  async set(value: T): Promise<void> {
    await this.item.setValue(value);
  }
}
