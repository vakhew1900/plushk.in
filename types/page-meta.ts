export const PageMetaField = {
  URL:          'url',
  DOMAIN:       'domain',
  TITLE:        'title',
  DESCRIPTION:  'description',
  AUTHOR:       'author',
  LANGUAGE:     'language',
  OG_TYPE:      'ogType',
  TAGS:         'tags',
  PUBLISHED_AT: 'publishedAt',
  CONTENT:      'content',
  EXTRAS:       'extras',
} as const;

export type PageMetaField = typeof PageMetaField[keyof typeof PageMetaField];

// ---

export interface PageMeta {
  url: string;
  domain: string;
  title: string;
  description?: string;
  author?: string;
  language?: string;
  ogType?: string;
  tags?: string[];
  publishedAt?: string;
  content?: string;
  extras?: Record<string, string | string[]>;
}

export function getMetaField(
  meta: PageMeta,
  field: string,
): string | string[] | undefined {
  if (field === PageMetaField.EXTRAS) return undefined;

  if (field in meta) {
    return meta[field as keyof Omit<PageMeta, typeof PageMetaField.EXTRAS>] as
      | string
      | string[]
      | undefined;
  }

  return meta.extras?.[field];
}
