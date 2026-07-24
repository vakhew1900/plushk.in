# Changelog

Finished tasks, moved here from `tasks.md` when completed. Kept for history — see git log for the actual code changes. Append-only: new entries go at the end, older ones aren't reordered.

### RULE-2 — Реальное выполнение chrome.bookmarks в AutoModeHandler/OffModeHandler
**Priority:** Medium
**Added:** 2026-07-06
**Completed:** 2026-07-08

`AutoModeHandler`/`HintModeHandler`/`OffModeHandler` (`services/*ModeHandler.ts`) сейчас только *решают*, куда должна попасть закладка (`BookmarkDecision`), но не выполняют сам `chrome.bookmarks.create`/`move`. Нужно: интерфейс-шлюз над `chrome.bookmarks` (create/move + find-or-create по `/`-разделённому пути в `targetFolder`, т.к. API работает с `parentId`, а не с именем/путём — сегменты пути резолвятся/создаются по одному, `chrome.bookmarks` не создаёт вложенные папки одним вызовом), мокирование в тестах через `vitest-chrome`. `AutoModeHandler` должен реально размещать закладку сам (включая случай `targetFolder: undefined` — тогда просто не резолвить путь и создавать без `parentId`, дефолтное поведение браузера); `OffModeHandler` — не вызывать шлюз вовсе.

### ARCH-2 — Единая точка входа для проверки Mode вместо разрозненных проверок
**Priority:** High
**Added:** 2026-07-17
**Completed:** 2026-07-19

Проверки `mode === Mode.X` (или `switch`/тернарники по режиму) сведены к использованию интерфейса `IBookmarkModeHandler` и создаваемых через `createModeHandler` обработчиков. Добавлено свойство `status` (типа `BookmarkDecisionStatus`) в интерфейс обработчиков.
- В `PopupQuickSave.tsx` рендеринг и логика сохранения переписаны на основе `handler.status`. Добавлен визуальный выбор папок через интерактивное дерево `FolderTree`.
- В `hooks/useQuickSave.ts` и `PopupActions.tsx` прямые проверки `mode` заменены проверками статуса обработчика.
- В `background.ts` обработка сообщения quick-save переписана с динамическим использованием `modeHandler.status` для определения папки.
- Исправлены тесты и добавлены соответствующие свойства в фиктивные обработчики.

### DEV-1 — Расширить specs-скилл: глубокая спецификация задачи (specs/tasks/<id>/)
**Priority:** Medium
**Added:** 2026-07-23
**Completed:** 2026-07-23

Добавлена в `specs`-скилл опциональная глубокая спецификация на задачу: `specs/tasks/<CATEGORY>-<N>-<slug>/` с `description.md` (контекст, ограничения, тестовые случаи, non-goals, ответы предварительного расспроса), `reference.md` (связанные задачи + тип связи: continuation/logic-change/refinement/fix/depends-on/supersedes) и папкой `reference/` для вспомогательных файлов. Папка создаётся не для каждой задачи, а по необходимости. Перед написанием `description.md` скилл обязан провести предварительный расспрос пользователя. `specs/tasks/` добавлена в `.gitignore` — хранится только локально. Реализовано вручную (`.claude/skills/specs/SKILL.md` + новый `reference/task-folder.md`, по аналогии со `scaffold`-скиллом, зеркалировано в `.agents/skills/specs/`) — установленный плагин `skill-creator` не подхватился текущей сессией без перезапуска, решили не ждать.

### SETTINGS-1 — Экспорт/импорт настроек автораспределителя единым файлом
**Priority:** Medium
**Added:** 2026-07-23
**Completed:** 2026-07-24

Добавлен экспорт и импорт всех данных, необходимых для корректной работы автораспределения закладок, единым JSON-файлом: правила (`BookmarkRule`), алиасы доменов (`DomainAlias`), группы соответствия страниц (`PageMatchGroup`) — то есть содержимое таблиц `rules`, `domainAliases`, `pageMatchGroups` из Dexie (`db/index.ts`). Позволяет перенести конфигурацию между установками/браузерами или сделать бэкап. Оба вопроса, не решённых на момент постановки, закрыты: версионирование файла — поле `version` (`SETTINGS_EXPORT_VERSION = 1`, `src/types/settings-export.ts`); конфликт при импорте — merge/upsert по id (Dexie `put` — записи не из файла не трогаются). Реализация: `SettingsExportImportService` (+`ISettingsExportImportService`) в `src/services/`, оркеструет `IBookmarkRuleRepository`/`IDomainAliasRepository`/`IPageMatchGroupRepository`; скачивание файла вынесено в отдельный `IFileService`/`FileService` (Blob + `<a download>`, без `chrome.downloads` и лишних permissions) — специально абстрагирован через интерфейс, чтобы то же место в будущем мог занять, например, `ObsidianService` (см. `EXPORT-1`); чистые хелперы (Map⇄Record для `PageMatchGroup`, `isSettingsExport` type guard) — в `src/lib/settings-export-mapping.ts` с тестами; UI в `ExportImportSection.tsx` подключён через новый хук `useSettingsExportImport`.

### TEST-1 — Тестовые примеры данных для импорта/экспорта закладок
**Priority:** Medium
**Added:** 2026-07-24
**Completed:** 2026-07-24

Подготовлены 3 набора тестовых данных в новой корневой папке `configs/` (вне `src/` — не часть сборки расширения), каждый — валидный `SettingsExport`-файл (`src/types/settings-export.ts`), пригодный для прямого импорта через `SettingsExportImportService`/UI вкладки «Главная»:
- `configs/mail/` — почтовые сервисы (Gmail/Mail.ru/Yandex/Yahoo) по доменам, без фильтрации по заголовку.
- `configs/it/` — Habr/dev.to: два правила на одних доменах с разным набором слов в заголовке через regex с границами слова (`\bIT\b`, `\b[Jj]ava(?:[Ss]cript)?\b` — обычный `wildcard` не подошёл бы, он матчит по подстроке и словил бы «IT» внутри «split»), с разными целевыми подпапками (`IT/Java` приоритетнее `IT/General`).
- `configs/social-extras/` — Reddit/DTF: `PageMatchGroup` с CSS-селекторами, проверенными на реальной разметке (`old.reddit.com`, `dtf.ru`), и правила, матчащие по извлекаемым `extras`-полям (`subreddit`, `hub`).

При подготовке обнаружены и вынесены в отдельные задачи два не связанных с `TEST-1` пробела, вскрывшихся при попытке написать реалистичные правила: `domainAliases` не резолвятся движком правил, только хранятся (`RULE-6`), и `PageMatchGroup`-инфраструктура извлечения `extras` со страницы нигде не подключена к реальному flow создания закладки (`RULE-5`) — поэтому правила в `configs/social-extras/` валидны для импорта/экспорта, но не сработают на живых закладках до реализации `RULE-5`. Подробности и обоснование селекторов — в `configs/README.md`.

