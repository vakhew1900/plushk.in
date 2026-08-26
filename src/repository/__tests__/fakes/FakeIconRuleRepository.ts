import type { IconRule } from '../../../types/icon-rule';
import type { IIconRuleRepository } from '../../interfaces/IIconRuleRepository';

/** Shared in-memory fake — used by more than one `services/__tests__/*` spec. */
export class FakeIconRuleRepository implements IIconRuleRepository {
  constructor(public rules: IconRule[] = []) {}

  async getAll(): Promise<IconRule[]> {
    return this.rules;
  }

  async getById(id: string): Promise<IconRule | undefined> {
    return this.rules.find((r) => r.id === id);
  }

  async save(rule: IconRule): Promise<void> {
    this.rules = [...this.rules.filter((r) => r.id !== rule.id), rule];
  }

  async remove(id: string): Promise<void> {
    this.rules = this.rules.filter((r) => r.id !== id);
  }
}
