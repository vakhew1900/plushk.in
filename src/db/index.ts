import Dexie, { type Table } from 'dexie';
import { BookmarkRuleField, type BookmarkRule } from '../types/rule';
import { DomainAliasField, type DomainAlias } from '../types/domain-alias';
import { PageMatchGroupField, type PageMatch } from '../types/page-match';
import { TagField, type Tag } from '../types/tag';
import { BookmarkTagLinkField, type BookmarkTagLink } from '../types/bookmark-tag-link';
import { EntityTypeField, type EntityType } from '../types/entity-type';
import { WorkflowField, type Workflow } from '../types/workflow';
import { WorkflowStatusField, type WorkflowStatus } from '../types/workflow-status';
import { BookmarkEntityLinkField, type BookmarkEntityLink } from '../types/bookmark-entity-link';

// Map<string, PageMatch> → Record for safe structured-clone storage
export type StoredPageMatchGroup = {
  id: string;
  aliasId: string;
  pageMatches: Record<string, PageMatch>;
};

const { ID: rId, PRIORITY, TARGET_FOLDER } = BookmarkRuleField;
const { ID: dId, NAME }                     = DomainAliasField;
const { ID: pId, ALIAS_ID }                 = PageMatchGroupField;
const { ID: tId, NAME: tName }              = TagField;
const { BOOKMARK_ID: btBookmarkId, TAG_IDS: btTagIds } = BookmarkTagLinkField;
const { ID: etId, NAME: etName }            = EntityTypeField;
const { ID: wId, ENTITY_TYPE_ID: wEntityTypeId } = WorkflowField;
const { ID: wsId, WORKFLOW_ID: wsWorkflowId } = WorkflowStatusField;
const { BOOKMARK_ID: belBookmarkId, ENTITY_TYPE_ID: belEntityTypeId } = BookmarkEntityLinkField;

class AppDb extends Dexie {
  rules!:               Table<BookmarkRule,         string>;
  domainAliases!:       Table<DomainAlias,          string>;
  pageMatchGroups!:     Table<StoredPageMatchGroup, string>;
  tags!:                Table<Tag,                  string>;
  bookmarkTags!:        Table<BookmarkTagLink,       string>;
  entityTypes!:         Table<EntityType,            string>;
  workflows!:           Table<Workflow,              string>;
  workflowStatuses!:    Table<WorkflowStatus,        string>;
  bookmarkEntityLinks!: Table<BookmarkEntityLink,    string>;

  constructor() {
    super('book-manager');
    // Single version: dev-only data, no real users yet, so there's no
    // migration chain to preserve — the schema is just rewritten in place
    // as it evolves (see CLAUDE.md/specs/changelog.md RULE-11 precedent).
    this.version(1).stores({
      rules:               `${rId}, ${PRIORITY}, ${TARGET_FOLDER}`,
      domainAliases:       `${dId}, ${NAME}`,
      pageMatchGroups:     `${pId}, &${ALIAS_ID}`,
      tags:                `${tId}, ${tName}`,
      bookmarkTags:        `${btBookmarkId}, *${btTagIds}`,
      entityTypes:         `${etId}, ${etName}`,
      workflows:           `${wId}, &${wEntityTypeId}`,
      workflowStatuses:    `${wsId}, ${wsWorkflowId}`,
      bookmarkEntityLinks: `${belBookmarkId}, ${belEntityTypeId}`,
    });
  }
}

export const db = new AppDb();
