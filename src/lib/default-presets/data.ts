import { PaletteColor } from '../../types/palette-color';
import { IconName } from '../../types/icon-name';
import type { Locale } from '../../locale';

/**
 * Single source of truth for the SETTINGS-2 first-launch presets — one table,
 * localized per name only. Generating both locales' `SettingsExport` from
 * this instead of hand-duplicating two near-identical files guarantees the
 * invariant the ru/en presets must hold: same ids, same colors, same icons,
 * same workflow/status structure — only `name` differs.
 */
export type LocalizedText = Record<Locale, string>;

export interface PresetStatusDef {
  key: string;
  name: LocalizedText;
  color: PaletteColor;
  order: number;
}

export interface PresetEntityDef {
  key: string;
  name: LocalizedText;
  icon: IconName;
  color: PaletteColor;
  /** Absent = entity has no workflow (SHELF-1: a bare EntityType is a valid state). */
  statuses?: PresetStatusDef[];
}

export interface PresetTagDef {
  key: string;
  name: LocalizedText;
  color: PaletteColor;
}

// order: lowest = default starting status (see WorkflowStatus doc comment).
const toStart = (ru: string, en: string): PresetStatusDef => ({ key: 'to-start', name: { ru, en }, color: PaletteColor.BLUE, order: 0 });
const inProgress = (ru: string, en: string): PresetStatusDef => ({ key: 'in-progress', name: { ru, en }, color: PaletteColor.YELLOW, order: 1 });
const done = (ru: string, en: string, order: number): PresetStatusDef => ({ key: 'done', name: { ru, en }, color: PaletteColor.GREEN, order });
const dropped = (order: number): PresetStatusDef => ({ key: 'dropped', name: { ru: 'Брошено', en: 'Dropped' }, color: PaletteColor.RED, order });

export const PRESET_ENTITIES: PresetEntityDef[] = [
  {
    key: 'books',
    name: { ru: 'Книги', en: 'Books' },
    icon: IconName.BOOK,
    color: PaletteColor.BLUE,
    statuses: [
      toStart('Буду читать', 'To Read'),
      inProgress('Читаю', 'Reading'),
      done('Прочитано', 'Read', 2),
      dropped(3),
    ],
  },
  {
    key: 'movies',
    name: { ru: 'Кино', en: 'Movies' },
    icon: IconName.MOVIE,
    color: PaletteColor.PURPLE,
    statuses: [
      toStart('Буду смотреть', 'To Watch'),
      inProgress('Смотрю', 'Watching'),
      done('Просмотрено', 'Watched', 2),
      dropped(3),
    ],
  },
  {
    key: 'games',
    name: { ru: 'Игры', en: 'Games' },
    icon: IconName.GAME,
    color: PaletteColor.GREEN,
    statuses: [
      toStart('Буду играть', 'To Play'),
      inProgress('Играю', 'Playing'),
      done('Пройдено', 'Completed', 2),
      dropped(3),
    ],
  },
  {
    key: 'articles',
    name: { ru: 'Статьи', en: 'Articles' },
    icon: IconName.ARTICLE,
    color: PaletteColor.TEAL,
    statuses: [
      { key: 'unread', name: { ru: 'Не прочитано', en: 'Unread' }, color: PaletteColor.BLUE, order: 0 },
      done('Прочитано', 'Read', 1),
    ],
  },
  { key: 'tools', name: { ru: 'Инструменты', en: 'Tools' }, icon: IconName.TOOL, color: PaletteColor.ORANGE },
  { key: 'images', name: { ru: 'Картинки', en: 'Images' }, icon: IconName.IMAGE, color: PaletteColor.PINK },
  { key: 'sites', name: { ru: 'Сайты', en: 'Sites' }, icon: IconName.LINK, color: PaletteColor.RED },
];

const TAG_PALETTE = [
  PaletteColor.RED,
  PaletteColor.ORANGE,
  PaletteColor.YELLOW,
  PaletteColor.GREEN,
  PaletteColor.TEAL,
  PaletteColor.BLUE,
  PaletteColor.PURPLE,
  PaletteColor.PINK,
];

function tag(index: number, key: string, ru: string, en: string): PresetTagDef {
  return { key, name: { ru, en }, color: TAG_PALETTE[index % TAG_PALETTE.length] };
}

export const PRESET_TAGS: PresetTagDef[] = [
  tag(0, 'fiction', 'Фантастика', 'Fiction'),
  tag(1, 'science', 'Наука', 'Science'),
  tag(2, 'it', 'IT', 'IT'),
  tag(3, 'entertainment', 'Развлечения', 'Entertainment'),
  tag(4, 'personal', 'Личное', 'Personal'),
  tag(5, 'work', 'Работа', 'Work'),
  tag(6, 'education', 'Обучение', 'Education'),
  tag(7, 'news', 'Новости', 'News'),
  tag(8, 'design', 'Дизайн', 'Design'),
  tag(9, 'health', 'Здоровье', 'Health'),
  tag(10, 'food', 'Еда', 'Food'),
  tag(11, 'tools', 'Инструменты', 'Tools'),
];
