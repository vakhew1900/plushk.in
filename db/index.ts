import Dexie, { type Table } from 'dexie';
import { BookmarkRuleField, type BookmarkRule } from '../types/rule';
import { DomainAliasField, type DomainAlias } from '../types/domain-alias';
import { PageMatchGroupField, type PageMatch } from '../types/page-match';

// Map<string, PageMatch> → Record for safe structured-clone storage
export type StoredPageMatchGroup = {
  id: string;
  alias_name: string;
  pageMatches: Record<string, PageMatch>;
};

const { ID: rId, PRIORITY, TARGET_FOLDER } = BookmarkRuleField;
const { ID: dId, NAME }                     = DomainAliasField;
const { ID: pId, ALIAS_NAME }               = PageMatchGroupField;

class AppDb extends Dexie {
  rules!:           Table<BookmarkRule,         string>;
  domainAliases!:   Table<DomainAlias,          string>;
  pageMatchGroups!: Table<StoredPageMatchGroup, string>;

  constructor() {
    super('book-manager');
    this.version(1).stores({
      rules:           `${rId}, ${PRIORITY}, ${TARGET_FOLDER}`,
      domainAliases:   `${dId}, ${NAME}`,
      pageMatchGroups: `${pId}, ${ALIAS_NAME}`,
    });
  }
}

export const db = new AppDb();
