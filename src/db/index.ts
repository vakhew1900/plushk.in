import Dexie, { type Table } from 'dexie';
import { BookmarkRuleField, type BookmarkRule } from '../types/rule';
import { DomainAliasField, type DomainAlias } from '../types/domain-alias';
import { PageMatchGroupField, type PageMatch } from '../types/page-match';
import { TagField, type Tag } from '../types/tag';

// Map<string, PageMatch> → Record for safe structured-clone storage
export type StoredPageMatchGroup = {
  id: string;
  alias_name: string;
  pageMatches: Record<string, PageMatch>;
};

const { ID: rId, PRIORITY, TARGET_FOLDER } = BookmarkRuleField;
const { ID: dId, NAME }                     = DomainAliasField;
const { ID: pId, ALIAS_NAME }               = PageMatchGroupField;
const { ID: tId, NAME: tName }              = TagField;

class AppDb extends Dexie {
  rules!:           Table<BookmarkRule,         string>;
  domainAliases!:   Table<DomainAlias,          string>;
  pageMatchGroups!: Table<StoredPageMatchGroup, string>;
  tags!:            Table<Tag,                  string>;

  constructor() {
    super('book-manager');
    this.version(1).stores({
      rules:           `${rId}, ${PRIORITY}, ${TARGET_FOLDER}`,
      domainAliases:   `${dId}, ${NAME}`,
      pageMatchGroups: `${pId}, ${ALIAS_NAME}`,
    });
    this.version(2).stores({
      rules:           `${rId}, ${PRIORITY}, ${TARGET_FOLDER}`,
      domainAliases:   `${dId}, ${NAME}`,
      pageMatchGroups: `${pId}, ${ALIAS_NAME}`,
      tags:            `${tId}, ${tName}`,
    });
  }
}

export const db = new AppDb();
