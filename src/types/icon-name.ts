/** Curated set of icons users can pick for an `EntityType` category. See `ICON_REGISTRY` in `components/icons/`. */
export const IconName = {
  LIBRARY: 'library',
  NETWORK: 'network',
  LINK: 'link',
  HOME: 'home',
  FOLDER: 'folder',
  ARTICLE: 'article',
  VIDEO: 'video',
  COURSE: 'course',
  MUSIC: 'music',
  CODE: 'code',
  TOOL: 'tool',
  NEWS: 'news',
  BLOG: 'blog',
  FORUM: 'forum',
  IMAGE: 'image',
  MOVIE: 'movie',
  MAP: 'map',
  SHOPPING: 'shopping',
  GAME: 'game',
  IDEA: 'idea',
} as const;
export type IconName = (typeof IconName)[keyof typeof IconName];
