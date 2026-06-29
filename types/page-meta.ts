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
  if (field === 'extras') return undefined;

  if (field in meta) {
    return meta[field as keyof Omit<PageMeta, 'extras'>] as
      | string
      | string[]
      | undefined;
  }

  return meta.extras?.[field];
}
