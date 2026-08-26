import { db } from '../db/index';
import type { IconRule } from '../types/icon-rule';
import { DexieRepository } from './DexieRepository';
import type { IIconRuleRepository } from './interfaces/IIconRuleRepository';

export class IconRuleRepository extends DexieRepository<IconRule, string> implements IIconRuleRepository {
  constructor() {
    super(db.iconRules);
  }
}
