export interface ICrudRepository<T, K = string> {
  getAll(): Promise<T[]>;
  getById(id: K): Promise<T | undefined>;
  save(entity: T): Promise<void>;
  remove(id: K): Promise<void>;
}
