import type { Table } from 'dexie';

export abstract class DexieRepository<T, K, TStored = T> {
  constructor(protected readonly table: Table<TStored, K>) {}

  async getAll(): Promise<T[]> {
    const stored = await this.queryAll();
    return stored.map((s) => this.fromStored(s));
  }

  async getById(id: K): Promise<T | undefined> {
    const stored = await this.table.get(id);
    return stored ? this.fromStored(stored) : undefined;
  }

  async save(entity: T): Promise<void> {
    await this.table.put(this.toStored(entity));
  }

  async remove(id: K): Promise<void> {
    await this.table.delete(id);
  }

  protected queryAll(): Promise<TStored[]> {
    return this.table.toArray();
  }

  // Identity by default (TStored = T); overridden where storage needs a
  // different shape than the domain type (e.g. Map<->Record mapping).
  protected toStored(entity: T): TStored {
    return entity as unknown as TStored;
  }

  protected fromStored(stored: TStored): T {
    return stored as unknown as T;
  }
}
