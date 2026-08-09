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

### RULE-7 — Настраиваемая папка по умолчанию для fallback-случая (когда ни одно правило не подошло)
**Priority:** Medium
**Added:** 2026-07-24
**Completed:** 2026-07-24

Раньше fallback в Auto-режиме (см. `specification.md`, сценарий 1) означал «браузер сам решает, куда положить закладку» — расширение вообще не трогало закладку, если ни одно правило не подошло (`BookmarkService.handleBookmarkCreated` не вызывал `repo.move`, когда `decision.targetFolder` не был задан). Добавлена настройка `defaultFolder` (новый `DefaultFolderSettingsRepository`/`IDefaultFolderSettingsRepository`, `wxt/utils/storage`, ключ `local:defaultFolder`, `/`-путь строкой, по умолчанию `''`) — папка, куда попадает закладка в этом fallback-случае вместо «как решит браузер». Пустое значение (по умолчанию) резолвится в Панель закладок (Bookmarks Toolbar) — переиспользована существующая логика `BookmarkRepository.resolveToolbarId()`, для чего `IBookmarkRepository.move()`/`BookmarkRepository.move()` расширены до опционального `targetFolder` (аналогично уже опциональному `targetFolder` у `create()`). `BookmarkService` теперь резолвит `decision.targetFolder ?? defaultFolderSettingsRepository.get()` перед вызовом `move()`; та же подстановка добавлена в quick-save путь `background.ts` (`RULE-3`) для PLACED-режимов. Настройка редактируется в новой секции `DefaultFolderSection` на вкладке «Главное» (`useDefaultFolder` хук + Input с путём + переиспользованный `FolderTree` — тот же UI-паттерн, что и в `ConfirmFolderView` попапа Hint-режима); строка fallback в карточке Auto-режима (`ModeCard`) теперь показывает реальное значение настройки вместо статичного текста «browser default» (новый ключ локализации `common.bookmarksBar` вместо убранного `common.browserDefault`). Скоуп сознательно ограничен только PLACED-путём Auto-режима — Hint-режим и так не создаёт pending-подсказку, если правило не подошло (`background.ts`: `if (decision.status === PENDING_CONFIRMATION && decision.targetFolder)`), это отдельный, не связанный с данной задачей пробел. `CLAUDE.md` и `specification.md` обновлены под новое поведение fallback.

### DEV-2 — Доска задач проекта в Obsidian через MCP
**Priority:** Low
**Added:** 2026-07-23
**Completed:** 2026-08-09

Заведена Kanban-доска `projects/plusk.in/mvp kanban.md` в личном vault пользователя (плагин Obsidian Kanban), подключённая через `obsidian-local-rest-api`'s MCP-сервер (сконфигурирован проектно-локально, вне git — см. `~/.claude.json`). Три колонки маппятся 1:1 на `specs/backlog.md`/`tasks.md`/`changelog.md`; карточка — `<ID> — <короткое название> (<priority>)`, чекбокс отмечен только в Done. Оба вопроса, не решённых на момент постановки, закрыты: единственный источник правды — файлы `specs/*.md`, доска — read-mostly отражение (не наоборот); MCP-сервер — `obsidian-local-rest-api` (встроенный MCP-эндпоинт плагина), Kanban-плагин — стандартный `obsidian-kanban` (mgmeyers), доска живёт в личном vault пользователя (`projects/plusk.in/`), не в отдельном vault под это. `specs`-скилл (`.claude/skills/specs/SKILL.md`, правило 9) обновлён: любое add/move/remove задачи теперь обязано зеркалиться на доску тем же тулом-вызовом, что редактирует `specs/*.md` — с явным фоллбэком (пропустить и предупредить пользователя), если MCP-сервер `obsidian` недоступен.

### DEV-5 — Настроен ESLint (flat config) с проверкой архитектурных слоёв
**Priority:** Medium
**Added:** 2026-08-09
**Completed:** 2026-08-09

В проекте не было вообще никакого линтера — только `tsc --noEmit`. Настроен ESLint 10 (`src/eslint.config.js`, flat config) поверх `typescript-eslint` (`recommendedTypeChecked`), `eslint-plugin-react-hooks` и `eslint-plugin-boundaries`; добавлены npm-скрипты `lint`/`lint:fix`.

`boundaries/dependencies` формализует и проверяет порядок слоёв из CLAUDE.md (`components → hooks → context → services → repository → db`) как явный граф зависимостей — раньше это держалось только на дисциплине и code review. Отдельные правила привязаны к уже сформулированным в CLAUDE.md конвенциям: `@typescript-eslint/no-explicit-any` (запрет `any`), `no-restricted-syntax` на `TSEnumDeclaration` (запрет `enum` в пользу `as const`-объектов), `no-restricted-imports` держит `dexie` только внутри `repository/`/`db/`, `no-console` (кроме `lib/debug-log.ts`), `@typescript-eslint/consistent-type-imports`.

Осознанные отклонения от rule-пресетов по умолчанию, оба — по явному решению пользователя в диалоге: `@typescript-eslint/require-await` выключен глобально (`async` документирует контракт метода как часть интерфейса, а не наличие `await` именно сегодня — иначе сигнатура металась бы туда-обратно при мелких правках реализации); `@typescript-eslint/no-misused-promises` настроен с `checksVoidReturn: { attributes: false }` — промис-возвращающий обработчик в JSX-пропе (`onClick`/`onSave` и т.п.) не требует `void`-обёртки, это стандартный в проекте fire-and-forget паттерн, а не забытый `await`; проверка остаётся включённой для остальных позиций (аргументы функций, переменные).

Заодно поправлены ~40 уже существовавших нарушений (floating/misused promises через `void`, лишние type assertion, `no-unsafe-assignment`) в ~20 файлах — без изменения поведения; тесты (140/140) проходят.

Сознательно не тронуто: 5 срабатываний `react-hooks/set-state-in-effect` (`FolderTree.tsx` ×2, `RulesTab.tsx`, `PopupQuickSave.tsx`, `useBookmarkSearch.ts`) — это не механическая правка синтаксиса, а реальный архитектурный паттерн (`setState` синхронно внутри эффекта), плюс часть файлов была под активной правкой пользователя в той же сессии. Оставлены как открытые находки линтера, не задача — пользователь решит, заводить ли отдельный backlog-пункт.

