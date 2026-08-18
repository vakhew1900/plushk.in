import ru from './ru.json';
import en from './en.json';

export const Locale = { RU: 'ru', EN: 'en' } as const;
export type Locale = typeof Locale[keyof typeof Locale];

export const dictionaries = { ru, en } satisfies Record<Locale, unknown>;

export type Dictionary = typeof ru;

type Leaf = string;

export type TranslationKey<T = Dictionary> = {
  [K in keyof T & string]: T[K] extends Leaf ? K : `${K}.${TranslationKey<T[K]>}`;
}[keyof T & string];
