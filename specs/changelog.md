# Changelog

Finished tasks, moved here from `tasks.md` when completed. Kept for history — see git log for the actual code changes. Append-only: new entries go at the end, older ones aren't reordered.

### BG-1 — `bookmarks.onRemoved`: удаление закладки каскадно чистит связанные записи
**Priority:** Medium
**Added:** 2026-08-11
**Completed:** 2026-08-19

`entrypoints/background.ts` сейчас пустой (`defineBackground(() => {})`, см. `UI-4`) — событие `bookmarks.onRemoved` не обрабатывается вообще, хотя таблица storage в `CLAUDE.md` уже давно резервирует под него строку «Remove metadata from IndexedDB (not yet implemented)». Возникла попутно при проектировании `SHELF-1`: удаление закладки должно каскадно чистить `BookmarkEntityLink`-строку (`bookmarkEntityLinkRepository.remove(bookmarkId)` — `bookmarkId` уже является PK таблицы `bookmarkEntityLinks`, просто вызов базового `remove()`, без нового метода в интерфейсе репозитория). Симметрично чистится и таблица связи тегов с закладками (`bookmarkTags`, `SEARCH-3`) — тем же способом, `bookmarkTagLinkRepository.remove(bookmarkId)`.

**Уточнение пользователя (2026-08-19), два раунда:** сначала оба вызова `remove()` вынесены из обработчика `background.ts` в отдельный сервис с названием, явно говорящим «удаляет вообще ВСЕ связи закладки», а не одну конкретную таблицу — задумано под будущий CRUD закладок из отдельного «менеджера» (список с ручным удалением), чтобы тот путь звал тот же метод, а не дублировал список `repository.remove()`-вызовов второй раз. Затем, по итогам обсуждения "а зачем отдельно, если можно в `BookmarkService`" — старый `BookmarkService` (удалён целиком в `UI-4`, координировал `Mode`-хендлеры) сейчас не существует; вместо узкого `BookmarkLinksCleanupService` заведён новый, **общий** `BookmarkService`, который со временем возьмёт на себя весь CRUD закладок (создание/удаление/т.п. поверх нескольких репозиториев разом), а не только очистку связей — сегодня в нём реализован только `removeAllLinksForBookmark`, остальное добавится по мере реальной необходимости (`IBookmarkRepository`/`chrome.bookmarks` пока не внедрён в конструктор — не нужен ни одному текущему методу).

Реализовано: `IBookmarkService`/`BookmarkService` (`src/services/`) — метод `removeAllLinksForBookmark(bookmarkId)`, оркеструет `bookmarkTagLinkRepository.remove()` + `bookmarkEntityLinkRepository.remove()` через `Promise.all` (без общей Dexie-транзакции — сервис не видит `db` напрямую, только репозитории; известный, уже отслеженный этой оговоркой класс риска — `AUDIT-7`). Зарегистрирован в `ServicesContext` (`bookmarkService`) для будущего вызова из UI (менеджер закладок), и инстанцируется напрямую в `background.ts` (в service worker `ServicesContext` недоступен — React нет, как и было до `UI-4` в аналогичных местах).

Рекурсивный обход поддерева при удалении **папки** целиком (`chrome.bookmarks.onRemoved` даёт одно событие на папку, `removeInfo.node` содержит вложенное поддерево) вынесен в чистую функцию `collectRemovedBookmarkIds` (`src/lib/bookmark-removed-subtree.ts`) — без побочных эффектов, только собирает id всех закладок-листьев из `BookmarkTreeNode`; `background.ts` мапит результат на вызовы сервиса. Вынесено в `lib/` специально ради юнит-тестируемости (CLAUDE.md требует тесты для `lib/`, но не для кода `entrypoints/`) — 4 теста на пустую папку, одиночную закладку, вложенные подпапки, отсутствующее поле `children`. `BookmarkService` — 2 теста (обе таблицы получают вызов; ошибка одного репозитория не проглатывается).

Миграция/бэкфилл для уже накопленных осиротевших связей не делалась — расширение ещё не вышло, установленных копий с реальными данными нет.

`SEARCH-8` (`backlog.md`, точечная выборка `chrome.bookmarks.get(ids)` вместо полного скана в `BookmarkSearchService`) заведена отдельно и по-прежнему не реализована — эта задача была её единственной блокирующей зависимостью, теперь снята.

### RULE-2 — Реальное выполнение chrome.bookmarks в AutoModeHandler/OffModeHandler
**Priority:** Medium
**Added:** 2026-07-06
**Completed:** 2026-07-08

`AutoModeHandler`/`HintModeHandler`/`OffModeHandler` (`services/*ModeHandler.ts`) сейчас только *решают*, куда должна попасть закладка (`BookmarkDecision`), но не выполняют сам `chrome.bookmarks.create`/`move`. Нужно: интерфейс-шлюз над `chrome.bookmarks` (create/move + find-or-create по `/`-разделённому пути в `targetFolder`, т.к. API работает с `parentId`, а не с именем/путём — сегменты пути резолвятся/создаются по одному, `chrome.bookmarks` не создаёт вложенные папки одним вызовом), мокирование в тестах через `vitest-chrome`. `AutoModeHandler` должен реально размещать закладку сам (включая случай `targetFolder: undefined` — тогда просто не резолвить путь и создавать без `parentId`, дефолтное поведение браузера); `OffModeHandler` — не вызывать шлюз вовсе.

### RULE-9 — Добавить `alias` в `PageMeta`
**Priority:** Medium
**Added:** 2026-07-24
**Completed:** 2026-08-09

`PageMeta` (`src/types/page-meta.ts`) получило необязательное поле `alias?: string`, заполняемое в `PageMetaFiller.fillPageMeta()` поиском `DomainAlias`, чей `domain_names` содержит `meta.domain` (через новую зависимость от `IDomainAliasRepository`, инжектируемую в `ServicesContext.tsx`); при отсутствии совпадения `alias` остаётся `undefined`. Единственная точка построения `PageMeta` — `PageMetaFiller`, вызываемая из `useQuickSave.ts` (второе место, упомянутое в исходной формулировке задачи — ручная сборка в `background.ts` — устарело из-за `UI-4`, того кода больше нет). Даёт `RULE-6` готовый путь резолвинга без нового DSL-узла — существующие `term`/`terms` могут матчить `field: "alias"` как обычное поле через `getMetaField`, например `{"term": {"alias": "Gmail"}}` вместо перечисления `gmail.com`/`mail.google.com` по отдельности.

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

### UI-4 — Бинарный режим ON/OFF и переработка попапа (дерево вместо экрана режимов, поиск вместо второго экрана)
**Priority:** Medium
**Added:** 2026-08-09
**Completed:** 2026-08-09

Реализовано полностью. `Mode` сведён к `ON`/`OFF` (`src/types/mode.ts`). Экран 1 попапа (`PopupQuickSave.tsx`) сразу показывает дерево папок (`FolderTree`) с предложенным путём и кнопкой «Сохранить», без промежуточного экрана и без кнопки «Отмена» — `QuickSaveView` (`lib/quick-save-view.ts`) содержит только `SAVED`/`OFF`/`SAVE`, `CONFIRM`/`confirming`-стейт не существует (закрывает `UI-3`). Экран 2 — поиск (`PopupSearch.tsx`, переиспользует `useBookmarkSearch`/`BookmarkSearchService`, тот же движок что и вкладка «Поиск» в настройках, `SEARCH-1`). Переключатель `ON`/`OFF` — `Switch` в `PopupHeader`, общий для обоих экранов вместе со стрелкой переключения экрана.

Нативная автосортировка убрана целиком: `background.ts` не содержит листенеров `bookmarks.onCreated`/`onImportBegan`/`onChanged` (сведён к пустому `defineBackground(() => {})`). Вся иерархия `IBookmarkModeHandler`/`AutoModeHandler`/`HintModeHandler`/`OffModeHandler`/`BookmarkDecisionStatus`/`createModeHandler`/`BookmarkService` удалена — единственный потребитель, попап, резолвит папку напрямую через `QuickSaveFolderResolver` (`useQuickSave.ts`). Механизм сообщения popup→background для quick-save и весь pending-hint код (`PendingHintRepository`/`usePendingHint`/`PopupActions`/`PopupHintConfirm`) удалены — `useQuickSave.ts` вызывает `IBookmarkRepository.create()` напрямую. Поглощает `UI-2` (цепочка `Mode→Status→View` перестала существовать вместе с типами) и часть `AUDIT-5` (бывшая `ARCH-10`) про `FolderTree.tsx`. Автосортировка нативных закладок остаётся отложенной идеей, см. `specs/ideas.md`.

### RULE-3 — Своё действие расширения для создания закладки (обход нативного попапа браузера)
**Priority:** Medium
**Added:** 2026-07-08
**Completed:** 2026-08-09

Изначальный план (сообщение popup→`background.ts` с синхронным флагом подавления эха `onCreated`) заменён более простым решением в ходе `UI-4`: раз нативная автосортировка убрана целиком, подавлять эхо больше не от чего. `useQuickSave.ts` создаёт закладку напрямую через `IBookmarkRepository.create()` — пользователь сохраняет страницу мимо системной звёздочки/Ctrl+D, а нативный попап браузера не мешает, т.к. попап расширения — единственная точка сохранения. Двухэкранный UI (быстрое сохранение / поиск) реализован как часть `UI-4`, а не отдельным селектором режима, как задумывалось изначально.

### RULE-5 — Подключить PageExtractorService/PageMatchGroup к реальному flow создания закладки
**Priority:** Medium
**Added:** 2026-07-24
**Completed:** 2026-08-09

`useQuickSave.ts` резолвит `PageMeta` в два шага: `PageMetaFiller.fillPageMeta()` даёт базовые поля сразу при открытии попапа, затем (если `Mode !== OFF`) `PageExtrasService.extract()` инжектит `content.ts` в активную вкладку через `browser.scripting.executeScript` (scoped `activeTab`) и накладывает извлечённые `extras` поверх базового `PageMeta` перед вызовом `QuickSaveFolderResolver.resolve()`. Изначальный план «пометить нативный `onCreated` как deprecated, но не отключать» снят сам собой — нативной автосортировки после `UI-4` больше нет вообще. Ручная проверка по `specs/verification.md` (секция RULE) — не отмечена, стоит прогнать перед релизом.

### SEARCH-1 — Вкладка «Поиск»: простой поиск по уже отсортированным закладкам
**Priority:** Low
**Added:** 2026-07-08
**Completed:** 2026-08-09

Реализовано в двух местах на одном движке: вкладка «Поиск» в настройках (`SearchTab.tsx`) и экран 2 попапа (`PopupSearch.tsx`, добавлен в `UI-4`). Общий хук `useBookmarkSearch` → `IBookmarkSearchService`/`BookmarkSearchService` — точное вхождение подстроки (без учёта регистра) по `title`/`url`/`folderPath` через `IBookmarkRepository.listAll()` (живое дерево `browser.bookmarks`, не персистентные метаданные — их не существует). `description`/fuzzy-поиск остаются отдельной `SEARCH-2`.

### ARCH-13 — FolderTree захардкожен на Chrome-id корневых папок, игнорирует Firefox
**Priority:** Medium
**Added:** 2026-08-09
**Completed:** 2026-08-09

Исправлено (обнаружено попутно при проверке готовности MVP — код уже не содержал жалующегося на находку паттерна). `FolderTree.tsx` больше не хардкодит `DEFAULT_EXPANDED_IDS = ['1', '2', '3']` — вместо литеральных Chrome-id корневых контейнеров дерево при первом рендере разворачивает все top-level узлы, реально пришедшие из `useFolderTree()`/`IBookmarkRepository.getFolderTree()` (`useEffect`, добавляющий `node.id` каждого корневого узла живого дерева в `expandedIds`). Работает одинаково в Chrome (числовые id) и Firefox (GUID-подобные `toolbar_____`/`unfiled_____`/`mobile______`) без завязки на конкретные литералы — по сути та же best-effort идея, что и `resolveToolbarId`, но через сами данные дерева, а не константу `BookmarkRootId`.

### UI-6 — Исследование: единая система размерных токенов для иконок и типографики
**Priority:** Low
**Added:** 2026-08-11
**Completed:** 2026-08-11

Исследовательская задача (без изменения кода на момент постановки) — по запросу пользователя, увидевшего непоследовательные размеры крестика (`IconX`) и заподозрившего, что проблема шире. Аудит подтвердил: все 15 (на тот момент) иконок в `src/components/icons/` принимали сырой `size?: number` (px), и на местах использования были расставлены произвольные числа (10–22, без общей шкалы) — не только у `IconX`. Аналогично `font-size` был объявлен вручную в 70+ местах в 38 CSS-модулях, без единого набора токенов, вперемешку `px`/`rem`. Результат — задокументированные варианты решения (CSS custom properties, семантический `size`-проп по образцу уже существующего `ButtonSize`, обёртки-компоненты для типографики) с оценкой трудозатрат и открытыми вопросами для пользователя. Глубокая спецификация (полный аудит, варианты, открытые вопросы) — `specs/tasks/UI-6-icon-typography-sizing-tokens/`. Пользователь в том же разговоре ответил на открытые вопросы (текст — минимум `size`+`weight`, дефолт — «средний», не самый мелкий размер; unify всех элементов) и сразу запросил реализацию — см. `UI-7`.

### UI-7 — Реализация: семантические размеры иконок + компонент Text для типографики
**Priority:** Medium
**Added:** 2026-08-11
**Completed:** 2026-08-11

Реализация по итогам `UI-6`, начатая в той же сессии сразу после утверждения пользователем предложенной шкалы.

**Иконки**: `components/icons/icon-size.ts` — `IconSize` (`as const`-объект `'sm'|'md'|'lg'`) + `ICON_SIZE_PX` (`14`/`16`/`20`, зеркалит `--icon-size-*` в `globals.css`, `0.875rem`/`1rem`/`1.25rem`). Все 16 иконок (15 исходных + `IconTag`, добавленный параллельно фичей тегов уже после аудита `UI-6` — подхвачен тем же проходом) переведены с `size?: number` на `size?: IconSize`. Все обнаруженные места использования (32 сайта) переведены с сырых чисел на семантический размер по правилу «не мельче, чем было» (бывшие 10–12px → `sm`(14), 13–17px и дефолт → `md`(16), 22px → `lg`(20)) — большинство прежних мелких значений (13–17px) сходятся в `md`, отсюда общий эффект «крупнее», о котором просил пользователь.

**Типографика**: новый `components/ui/text.tsx` — компонент `Text` (`size`: `heading`/`subheading`/`body`/`caption`/`code`; `weight`: `regular`/`medium`/`bold`, дефолт зависит от `size`; `tone`: `default`/`muted`/`accent`, поверх существующих `--text`/`--muted`/`--accent`; `as` — переопределение HTML-тега независимо от визуального размера). Токены `--fs-*`/`--fw-*`/`--font-mono` добавлены в `globals.css`. Мигрирован органически повторявшийся паттерн `.h2`+`.sectionDesc`/`.title`+`.desc`/`.lead` (8 файлов: `TabHeader`, `AliasesSection`, `VariablesSection`, `ExportImportSection`, `DefaultFolderSection`, `ThemeSection`, `ModeCard`, `TagsSection`) — при миграции размер вторичного текста (`sectionDesc`/`desc`) намеренно поднят с исходного ~12.5px до `body`(14px) вместо `caption`(12px), т.к. пользователь отдельно просил не самый мелкий размер по умолчанию. Отдельно, механической заменой без изменения размеров, литерал `'JetBrains Mono', monospace` заменён на `var(--font-mono)` в 20 файлах.

**Не мигрировано в этом проходе** (сознательно, по аналогии с уже принятым в CLAUDE.md правилом «не обязательно мигрировать существующие `.module.css` целиком, только когда переписываешь файл по другой причине»): длинный хвост из ~25 файлов с точечными `font-size` (бейджи, `CodeView`, редакторы условий правил, строки алиасов/переменных/тегов и т.п.) — токены/компонент уже на месте, эти файлы мигрируются по мере следующего касания, а не отдельным большим проходом.

**Документация конвенции** (обязательный пункт, зафиксированный в `UI-6`): `CLAUDE.md` (секция Code rules — правило про SVG-иконки дополнено про `size`, добавлено новое правило про `Text`; секция Theme — добавлен раздел «Sizing tokens») и скилл `scaffold` (`.claude/skills/scaffold/reference/component.md`, правило 8) обновлены новой конвенцией, чтобы новый код по умолчанию писался уже с семантическим размером, а не разъезжался заново.

`tsc --noEmit` и `eslint` прогнаны после миграции — 0 новых ошибок (существующие 6 — предсуществующие, не связанные с этой задачей, см. `DEV-5`/`MainTab.tsx` мёртвый код).

### UI-10 — Сохранение активной вкладки настроек через URL query-параметр
**Priority:** Low
**Added:** 2026-08-14
**Completed:** 2026-08-14

Пользователь пожаловался, что `AppShell` (`entrypoints/options/App.tsx`) сбрасывал активную вкладку на «Main» при каждом обновлении страницы настроек — обычный `useState<Tab>`, ничего не персистировал. Сравнили два подхода: хранение в `chrome.storage` через новый репозиторий (по образцу `ModeSettingsRepository`/`useMode`) или в URL страницы (`?tab=rules`). Выбран URL — не тянет зависимость, не требует async-раунд-трипа через репозиторий (а значит нет мигания дефолтной вкладки на первом рендере), и сам по себе переживает обычный F5, что и было целью жалобы; ценой того, что закрытие вкладки браузера состояние не сохраняет (осознанный трейд-офф, не тот сценарий).

Отдельно обсуждалось, не завести ли ради этого роутинг-библиотеку (react-router/wouter/nuqs) — отклонено: один enum-параметр с 5 известными значениями, без вложенных маршрутов и программной навигации, не оправдывает новой архитектурной зависимости на весь проект; используется намеренно `history.replaceState` (не `pushState`), чтобы Back/Forward не листали вкладки — большинство роутеров заточены как раз под обратное поведение.

Реализовано: `Tab` в `components/options/OptionsSidebar.tsx` переведён с union-типа на `as const`-объект (нужно было для валидации значения из URL против набора допустимых, заодно устранило сравнения с сырыми строковыми литералами). Новый `hooks/useOptionsTab.ts` — читает `?tab=` при монтировании (`URLSearchParams`, с фолбэком на `Tab.MAIN` при отсутствии/невалидном значении), пишет через `history.replaceState` при каждом переключении. `AppShell` подключён к хуку вместо локального `useState`. Без юнит-теста — как и у `useMode`/`useDefaultFolder`, ближайших аналогов по паттерну, тестами по CLAUDE.md обязаны быть покрыты только `lib/`-функции и классы сервисов/репозиториев, не хуки.

Смежная, отдельно не реализованная идея (deep-link из попапа сразу в конкретную вкладку настроек, и возможная будущая потребность в полноценном роутере при переходе на многостраничность) — оставлена как заметка в `specs/ideas.md`.

**Продолжение в том же разговоре**: пользователь заметил, что `RuleListItem.tsx` рисует крестик удаления сырым текстовым глифом `×` в `<button>` вместо `IconX` — рассинхрон с только что построенной системой. Проверка по всему `src/` нашла ещё 6 таких мест: `TagRow.tsx`, `VariableBlock.tsx` (×2 крестика), `AliasRow.tsx` (×2 крестика + один `+`) — все стилизовались через `font-size`/`line-height` на самом `<button>`, без всякого отношения к `IconSize`. Все переведены на `<IconX size="sm" />`/`<IconPlus size="sm" />`, у соответствующих CSS-классов `font-size`/`line-height` заменены на `display: inline-flex; align-items: center; justify-content: center;` для центрирования SVG. Стрелка `→` в `VariableBlock.tsx` (между полями «ключ» и «значение») намеренно не тронута — это типографский разделитель, а не иконка-кнопка, категориально другой случай.

Правило про сами эти находки задокументировано (не было зафиксировано первым проходом реализации): `CLAUDE.md` (Code rules, рядом с правилом про SVG-иконки) и скилл `scaffold` (`component.md`, правило 8) теперь явно запрещают сырой юникод-глиф (`×`/`+`/`→` и т.п.) как содержимое кликабельного элемента вместо иконки-компонента — с явной оговоркой, что глиф как типографский разделитель в обычном тексте (не внутри `<button>`/`onClick`) иконкой не считается и остаётся текстом.

### RULE-12 — Привязать PageMatchGroup к DomainAlias по id вместо свободного alias_name
**Priority:** Medium
**Added:** 2026-08-14
**Completed:** 2026-08-14

Реализовано по плану из глубокой спецификации (`specs/tasks/RULE-12-page-match-group-alias-link/`). `PageMatchGroup.alias_name: string` → `aliasId: string`, реальный FK на `DomainAlias.id` (`types/page-match.ts`), с уникальным индексом `&aliasId` на `pageMatchGroups`. Пользователь уточнил в ходе реализации: раз реальных пользователей ещё нет, отдельная версия Dexie-схемы под это изменение не нужна — `db/index.ts` схлопнут обратно в единственный `db.version(1)` с финальной формой всех 9 таблиц (вместо цепочки `version(1..5)`, изначально заведённой этой же задачей); аналогично `SETTINGS_EXPORT_VERSION` (`types/settings-export.ts`) оставлен `1` вместо инкремента до `3`. Тот же принцип, что уже применялся в `RULE-11` — просто доведён на этот раз до отказа от промежуточных версий вовсе, а не только от миграции данных.

`VariableBlock` — текстовое поле имени заменено на `Select` (новая тонкая обёртка `components/ui/select.tsx` над `@radix-ui/react-select`, новая прямая зависимость; новый `IconChevronDown`) со списком `DomainAlias`. `VariablesSection` — уже занятые другой группой алиасы не предлагаются в выпадающем списке (собственный алиас группы остаётся выбираемым); «Добавить группу» задизейблена с подсказкой, когда нет ни одного `DomainAlias` без группы (создаёт новую группу сразу на первом незанятом алиасе — без промежуточного «пустого» состояния).

`DomainAliasRepository.remove()` переопределён — каскадно удаляет привязанную `PageMatchGroup` в одной транзакции перед удалением самого алиаса (по образцу `TagRepository.remove()`/`SEARCH-4`).

`PageMetaFiller.fillPageMeta()` меняет контракт (`IPageMetaFiller`) — возвращает `{ meta: PageMeta; aliasId?: string }` вместо голого `PageMeta` (резолвит `DomainAlias` целиком, не только `.name`). `useQuickSave.ts` использует `aliasId`, чтобы найти не более одной подходящей `PageMatchGroup` и передать в `PageExtrasService.extract()` только её — вместо `pageMatchGroupRepository.getAll()` без фильтрации, как было раньше (пробел, оставленный `RULE-5`).

Экспорт/импорт настроек: `ExportedPageMatchGroup.alias_name` → `aliasId`, `SETTINGS_EXPORT_VERSION` остался `1` (см. выше). `configs/social-extras/settings.json` обновлён под новую схему (`aliasId`, реально указывающий на существующие `test-alias-reddit`/`test-alias-dtf`); `configs/mail/settings.json`/`configs/it/settings.json` (пустые `pageMatchGroups`, поля не переименовывались) синхронизированы на `"version": 1`, раз они всё равно должны совпадать с `SETTINGS_EXPORT_VERSION` для успешного импорта.

`tsc --noEmit`, `eslint`, `vitest run` (166/166) прогнаны после реализации — 0 новых ошибок; 6 предсуществующих lint-ошибок (`FolderTree.tsx`, `MainTab.tsx`, `PopupQuickSave.tsx`, `useBookmarkSearch.ts`) не в затронутых файлах, не связаны с этой задачей. `npm run build:firefox` (реальная сборка WXT) — успешно. Ручная проверка по `specs/verification.md` (секция RULE, новые пункты `RULE-12`) — не отмечена, стоит прогнать перед релизом; в этой сессии не было доступа к инструментам управления реальным браузером (нет `chromium-cli`/Playwright/`web-ext` в окружении), так что клик-тест выпадающего списка алиасов, каскадного удаления и quick-save на живой странице пользователю стоит прогнать вручную через `dev:firefox`.

### UI-9 — Мелкая доработка визуального дизайна (шрифты, цвета, общая полировка)
**Priority:** Low
**Added:** 2026-08-13
**Completed:** 2026-08-14

Интервью и реализация прошли в одной сессии — пользователь пришёл сразу с конкретным списком из 9 пунктов вместо абстрактного «сделать приятнее» (снимает открытый на момент постановки вопрос об отдельном интервью-проходе). Часть пунктов чинилась напрямую в коде, часть — через сравнение вариантов в опубликованном Claude Artifact (живой превью на настоящих токенах/компонентах проекта, с переключателем тёмная/светлая тема), после чего пользователь указал варианты и они были внедрены.

**Починено в коде напрямую, без вариантов на выбор:**
- Тема (`dark`/`light`/`system`) не сохранялась между перезагрузками страницы настроек — заведён `ThemeSettingsRepository`/`IThemeSettingsRepository` (`wxt/utils/storage`, ключ `local:theme`, по образцу `ModeSettingsRepository`), подключён в `ThemeContext`.
- Выпадающие списки тегов/статусов игнорировали выбранную тему, всегда выглядели тёмными. Корень: Radix-порталы (`Select`/`DropdownMenu`/`Popover`) рендерятся в `document.body`, вне `div`, несущего `data-theme` — портальный контент наследовал фолбэк `:root` (тёмный) независимо от темы. Фикс — `ThemeContext` дополнительно зеркалит `data-theme` на `document.documentElement`.
- Можно было сохранить тег/сущность/workflow-статус/алиас домена/правило с пустым (или из пробелов) именем. Добавлен `zod` (`^4.4.3`, прямая зависимость), хелпер `hasValidName` (`src/lib/validation/named-entity.ts`), опциональный `isValid`-гейт в `useCrudResource.save()` — локальный стейт обновляется оптимистично (черновик виден при наборе), но запись в репозиторий пропускается, пока имя невалидно; `onBlur` на name-полях (`TagRow`/`WorkflowStatusRow`/`EntityDetailPanel`/`AliasRow`) удаляет брошенную пустую строку. `RuleEditor`: `canSave` дополнен `hasValidName(name)`. Осознанно не сделано: валидация только на уровне хука/UI, не в самом репозитории — единственный реальный путь записи этих сущностей уже проходит через `useCrudResource`, второй уровень защиты сочли избыточным для MVP.
- Длинные имена тегов не обрезались — `BookmarkTagChip` получил `.label` с `overflow:hidden`/`text-overflow:ellipsis`/`max-width`. Путь папки (`BookmarkFolderPath`) оставлен как есть (перенос строк) — пользователь подтвердил, что там перенос устраивает.
- Сайдбар настроек не дотягивался до низа страницы — `App.module.css` `.root` использовал `min-height:100vh` вместо `height:100%` (пропущенная пропагация от `html`/`body`/`#root`, которые уже были `height:100%`); `.body` переведён на `flex:1;min-height:0`. Мёртвые неиспользуемые классы `.chrome`/`.dots`/`.dot`/`.chromeTitle` в том же файле замечены, но не тронуты (не относятся к этой задаче).

**Выбрано через Claude Artifact и внедрено:**
- Шрифты: `Hanken Grotesk` → **Manrope** (основной), `JetBrains Mono` → **IBM Plex Mono** (моно) — `assets/globals.css` (`@import`, `--font-mono`, `body`), оба `entrypoints/{options,popup}/App.module.css`. Побочный эффект, обнаруженный при подготовке артефакта: у `Hanken Grotesk` Google Fonts не отдавал (ни при каком запрошенном наборе весов) блок с базовой кириллицей — только `latin`/`latin-ext`/`cyrillic-ext` (последний покрывает лишь редкие буквы вроде ѣ/ѳ, не а-я). Русский текст интерфейса тихо откатывался на системный шрифт браузера, а английские слова/цифры в тех же экранах оставались в `Hanken Grotesk` — вероятная причина исходной жалобы «шрифт не подходит в некоторых местах». `Manrope`/`IBM Plex Mono` (как и рассмотренные, но не выбранные `Inter`/`Golos Text`) проверены — отдают полноценный `cyrillic`-блок.
- Кнопки: `Button` `size="sm"` (использует «+ Тег», «+ Категория» и т.п.) — 32px→34px высотой, радиус 8px→6px, паддинг 12px→15px (`components/ui/button.module.css`).
- Акцент сущности/статуса, два прохода: сначала обе таблетки собраны в углу карточки крупнее и с тенью; после отзыва пользователя увеличены ещё раз (паддинг/шрифт/жирность вверх, `PaletteDot` sm→md) и **разнесены по разным местам карточки** — категория осталась в правом верхнем углу `topRow` (`EntitySegment`), статус переехал в новый `.bottomRow`, на одну строку с тегами, прижат к правому краю (`StatusSegment`, `BookmarkTagList`'s `.wrap` получил `flex:1;min-width:0`, чтобы теги делили строку со статусом). Общий `BookmarkEntityControl`-компонент, изначально державший обе таблетки вместе, удалён целиком — `EntitySegment`/`StatusSegment` рендерятся независимо в `BookmarkCard.tsx`, который сам вызывает `useBookmarkEntityEditor`; каждый сегмент теперь сам останавливает всплытие клика на своей кнопке (раньше это делала общая обёртка). Побочная правка, вызванная переносом в угол: старый дублирующий бейдж последней папки в `topRow` (уже показывался целиком через `BookmarkFolderPath` ниже) убран — конфликтовал за то же место с укрупнённым акцентом.
- Редактирование тегов: значок-карандаш (`IconEdit`, не через общий `Button`) заменён на настоящую `Button` (`variant="outline" size="sm"`) с `IconTag` и подписью — локаль-ключ `bookmarkTagEditor.editButton` со значения «Edit»/«Редактировать» на «Tags»/«Теги» (кнопка теперь подписана явно, а не только через `title`-тултип).

**Переименование в интерфейсе (в той же сессии, отдельная просьба):** «Сущность»/«Entity» → «Категория»/«Category» во всех видимых строках (`entitiesSection.*`, `bookmarkEntityControl.*`, `categoriesTab.lead`, оба `en.json`/`ru.json`); «Добавить сущность» (длинное) → короткое «Категория», в одном стиле с «+ Тег»/«+ Правило»/«+ Статус». **Только текст локали** — код (`EntityType`, `entityTypeRepository`, `EntitySegment`, `useEntityTypes` и т.п.) сознательно не переименован, это отдельный более крупный рефакторинг, не запрошенный в этой сессии.

`tsc --noEmit`, `vitest run` (172/172), `eslint` прогнаны после каждого прохода правок — 0 новых ошибок; те же 6 предсуществующих lint-ошибок, что и в `RULE-12`, не в затронутых файлах. Ручная проверка в браузере не проводилась (нет доступа к инструментам управления реальным браузером в этой сессии, см. `RULE-12`) — стоит прогнать `dev:firefox` и визуально сверить новую раскладку карточки (особенно перенос статуса в нижний ряд и увеличенные таблетки) перед релизом.

### SEARCH-3 — Теги для закладок: хранение (имя + цвет) и вкладка «Теги»
**Priority:** Medium
**Added:** 2026-07-24
**Completed:** 2026-08-11

Ранее в бэклоге как «хранение и поиск по тегам» — при подхвате разбито на три отдельные задачи: эта закрывает только хранение (список тегов с именем и цветом, CRUD); присвоение тега закладке — `SEARCH-4`; поиск/фильтр по тегам — `SEARCH-5`. Правила автоподбора тегов — отдельная `RULE-4`.

Реализовано: `Tag`/`TagField`/`TagColor` (`src/types/tag.ts`) — фиксированная палитра из 8 цветов (не свободный hex/color-picker), хранится как семантический ключ (`'red'`, `'orange'`, …), не сырой цвет — резолвится в CSS через `var(--tag-${color})`, токены `--tag-*` заведены в `assets/globals.css` отдельно от семантических `--red`/`--green`/`--blue` (те означают error/success/info в остальном UI, цвет тега не должен занимать это же значение). `ITagRepository`/`TagRepository extends DexieRepository<Tag, string>` (переиспользует `ARCH-7`), таблица `tags` в новой `db.version(2).stores({...})` (существующие три таблицы переобъявлены без изменений индексов). Новая вкладка «Теги» в сайдбаре настроек (`TagsTab` → `components/options/tabs/tags/{TagsSection,TagRow,TagColorPicker}`) — по образцу `AliasesTab`/`AliasesSection`/`AliasRow`. `TagColorPicker` — тонкая обёртка над `RadioGroup`/`RadioGroupItem` (тот же паттерн, что `GroupTypeSwitcher`), не кастомный виджет и не новая Radix-зависимость — визуальный вариант (скруглённый квадрат, обводка в `--text` у выбранного) выбран пользователем из 3 вариантов, показанных на артефакте.

Глубокая спецификация — `specs/tasks/SEARCH-3-tag-storage/`.

**Примечание при сверке specs/Obsidian-доски (`UI-9`, 2026-08-14):** задача была фактически реализована 2026-08-11 (см. `git log` — `2799e40 add:[SEARCH] add tags`, `e2caa05`, дата коммита), но по недосмотру осталась в `tasks.md` вместо переноса сюда — обнаружено и исправлено задним числом при полной сверке доски со specs-файлами.

### ARCH-14 — useBookmarkRules не пересортировывает список по priority после локального save()
**Priority:** Medium
**Added:** 2026-08-09
**Completed:** 2026-08-09

`useBookmarkRules.save()` (`src/hooks/useBookmarkRules.ts:25`) обновляет локальный `items` на месте (`prev.map(...)`) или добавляет в конец (`[...prev, rule]`), не пересортировывая по `priority` — хотя `BookmarkRuleRepository.getAll()` отдаёт список строго отсортированным (`orderBy('priority').reverse()`), и именно на этот порядок опирается и вычисление правил (`findMatchingRule`), и отображаемый в `RuleListItem`/`RulesTab` номер строки как ранг приоритета. Если пользователь меняет `priority` существующего правила в `RuleEditor` и жмёт «Сохранить», список в UI остаётся в прежнем порядке с прежними номерами до перезагрузки страницы настроек — вводит в заблуждение относительно реального порядка вычисления правил. Обнаружено при архитектурном аудите по запросу пользователя; смежно с `ARCH-12` (там — рассинхронизация стейта хука с записями *извне*, через импорт; здесь — тот же хук расходится с репозиторием даже через собственный `save()`).

**Уточнение**: НЕ чинится автоматически фиксом `ARCH-12` (тот чинит только кросс-вкладочную рассинхронизацию от *внешней* записи; здесь баг в том, что хук расходится с собственным `save()` в рамках одного и того же монтирования). Точечный фикс реализован: `items` пересортировывается по `priority` (descending) после `save()` — сначала прямо в `useBookmarkRules.ts`, позже (см. `ARCH-7`) вынесено в переиспользуемый `postProcess`-хук `byPriorityDesc`, передаваемый в `useCrudResource`.

### ARCH-7 — Generic-базовый класс для CRUD-бойлерплейта репозиториев
**Priority:** Low
**Added:** 2026-07-29
**Completed:** 2026-08-09

`BookmarkRuleRepository`, `DomainAliasRepository`, `PageMatchGroupRepository` (`src/repository/`) почти построчно дублировали `getAll/getById/save/remove` через Dexie — отличались только именем таблицы. `ModeSettingsRepository`/`DefaultFolderSettingsRepository` аналогично дублировали обёртку `storage.defineItem().get()/.set()`. Обнаружено при архитектурном аудите.

**Подхвачена вместе с `ARCH-12`** по просьбе пользователя (заодно, раз репозитории и так трогали). Раз `ARCH-12` не потребовал subscribe/notify, это чистый CRUD-бойлерплейт рефакторинг: `DexieRepository<T, K>` (Template Method) для трёх Dexie-репозиториев, `StorageItemRepository<T>` для repository поверх `wxt/utils/storage` (`ModeSettingsRepository`, позже и `ThemeSettingsRepository` — см. `UI-9`); специфичная логика (`toStored`/`fromStored` Map↔object в `PageMatchGroupRepository`) осталась в наследниках. Без subscribe/notify в базовых классах.

Точная сигнатура — `specs/tasks/ARCH-7-generic-repository-base/`.

### UI-5 — Универсальный toast (всплывающее уведомление) в правом нижнем углу
**Priority:** Medium
**Added:** 2026-08-09
**Completed:** 2026-08-09

Сейчас после импорта/экспорта настроек (`ExportImportSection.tsx`) нет никакой success-обратной связи, а ошибка показывается статичным inline-текстом под кнопками (`useSettingsExportImport.ts`) — легко пропустить. Обнаружено пользователем при обсуждении ARCH-12/14/7.

**Решение**: универсальный toast (не завязанный на импорт/экспорт конкретно) — семантический вариант `ToastVariant` (`success`/`error`, `types/toast.ts`, `as const` по конвенции проекта), цвет берётся из уже существующих `--green`/`--red` токенов темы (`assets/globals.css`), а не произвольным цветом-пропом. Автозакрытие через таймаут + ручное закрытие крестиком (стандартное поведение Radix `Toast.Root`). Показывается в правом нижнем углу через `Toast.Viewport`.

Архитектура (учитывая `boundaries/dependencies` ESLint-правило — `context/` не может импортировать из `components/`): `types/toast.ts` (`ToastVariant` + `ToastItem`, общий тип для контекста и компонента) → `context/ToastContext.tsx` (чистый стейт — очередь `toasts`, `show()`, `dismiss()`, без JSX-разметки самого тоста) → `hooks/useToast.ts` (тонкий хук поверх контекста, как `useTheme`/`useTranslation`) → `components/ui/toast.tsx` (тонкая обёртка над Radix `Toast.Root/Title/Description/Close`, по одному тосту, иконки `IconCheck`/`IconX` уже есть в `components/icons/`) → `components/Toaster.tsx` (владеет Radix `Toast.Provider`/`Toast.Viewport`, мапит очередь из `useToast()` на `<Toast>`). `Toaster` монтируется один раз в `entrypoints/options/App.tsx` (внутри `ToastProvider`, рядом с `Theme`/`Locale`/`Services`).

`@radix-ui/react-toast` добавлен как прямая зависимость (по образцу `@radix-ui/react-switch`/`@radix-ui/react-radio-group`).

`useSettingsExportImport.ts` — существовавший inline-текст ошибки убран полностью, заменён вызовом `useToast().show(...)` на успех/ошибку и экспорта, и импорта.

Сознательно ограничено: только вкладка Options подключена (`Toaster`/`ToastProvider` в `App.tsx`); popup не подключён — нет сценария использования там, при появлении подключить туда тем же способом.

**Примечание при сверке specs/Obsidian-доски (`UI-9`, 2026-08-14):** все три задачи выше (`ARCH-14`, `ARCH-7`, `UI-5`) реализованы одним заходом 2026-08-09 (см. `git log` — коммит `0549229 refactor:[UI][RULE] add toast for import` для `UI-5`/`ARCH-7`/начальной версии `ARCH-14`-фикса), Obsidian-доска уже отражала их в колонке Done (просто без галочки) — но перенос из `tasks.md` сюда был пропущен. Обнаружено и исправлено задним числом при полной сверке.

### RULE-11 — Унификация поля потомков у AND/OR/NOT (`and`/`or`/`not` → `nodes`)
**Priority:** Medium
**Added:** 2026-08-11
**Completed:** 2026-08-11

`AndRule`/`OrRule`/`NotRule` (`src/types/rule.ts`) хранили потомков в поле, чьё имя совпадает с дискриминантом (`and`/`or`/`not`), хотя `type` уже однозначно их различает — из-за этого структурно идентичная логика («достать потомков», «пересобрать с новыми потомками», «пройтись и схлопнуть») была продублирована трижды в `rule-draft.ts` (`getDraftChildren`/`withDraftChildren`/`withDraftGroupType`, `ToDraftVisitor`, `fromDraftNode`, `ErrorVisitor`) и `rule-evaluator.ts` (`isRuleNode`, `EvaluatorVisitor`, `LeafCounterVisitor`). Обнаружено и решено в ходе code-review-диалога про `rule-draft.ts` — сознательное отступление от правила CLAUDE.md «не рефакторить под гипотетическое будущее», т.к. дублирование уже присутствовало в коде, а не гипотетическое.

Унифицированное имя — `nodes: RuleNode[]` (выбор пользователя из `nodes`/`children`); `type` не изменился. Данные в IndexedDB не мигрировались (dev-данные без реальных пользователей, пересоздаются вручную) — Dexie-миграция технически не нужна, `stores()` не декларирует форму `condition`. `CLAUDE.md` (секция Rule DSL) переписан под новую JSON-форму. Глубокая спецификация — `specs/tasks/RULE-11-unify-compound-nodes-field/`.

**Примечание при сверке specs/Obsidian-доски (`UI-9`, 2026-08-14):** задача реализована в тот же день, что и добавлена (`git log` — `c2e7e6d refactor:[RULE] refactor rules`, 2026-08-11), но перенос сюда был пропущен. План изначально предполагал поднять `SETTINGS_EXPORT_VERSION` `1`→`2` — этого не произошло: позже, при `RULE-12` (2026-08-14), пользователь явно установил принцип «версии экспорта/схемы не поднимаются ради самого факта структурного изменения, пока нет реальных пользователей» (там `SETTINGS_EXPORT_VERSION` тоже сознательно оставлен на месте вместо инкремента). Формально `RULE-11` этот принцип ещё не описывал (появился на два дня позже), но итоговое состояние кода ему соответствует — версия так и осталась `1`.

### SHELF-1 — Сущности (Книга/Видео/...) и привязанный к ним workflow-статус закладки
**Priority:** Medium
**Added:** 2026-08-11
**Completed:** 2026-08-13

Пользователь помимо тегов (`SEARCH-3`, отдельный, независимый трек — просто поиск, без статусов) хотел **пользовательские сущности контента** (Книга, Видео, ...), каждая из которых может нести свой **workflow** — упорядоченный список статусов (буду читать/читаю/завершено/заброшено — и аналогично для видео). У закладки — ровно одна сущность или ни одной (подтверждено интервью, композитная связь bookmarkId+entityTypeId не нужна). Workflow хранится как часть самой `EntityType` (связь 1:1, не отдельная переиспользуемая сущность) — так каскад «удалили сущность → удалился её workflow» происходит бесплатно, простым удалением одной записи, без отдельной таблицы/FK на неё. У связи закладка↔сущность отдельно хранится **текущий** выбранный статус (ссылкой на id одного из вариантов workflow).

Глубокая спецификация и протокол интервью — `specs/tasks/SHELF-1-entity-workflow/`.

Каскадная очистка `BookmarkEntityLink` при удалении закладки браузером (`bookmarks.onRemoved`) — намеренно вынесена в отдельную `BG-1` (`backlog.md`); репозиторий (`BookmarkEntityLinkRepository`, зарегистрирован в `ServicesContext`) готов, реализация самого обработчика — за `BG-1`.

**Пересмотр UI (в этой же сессии, до начала реализации)**: отдельной вкладки «Shelf» не было — пользователь решил не плодить вкладки, а доложить связанный функционал на уже существующие, по образцу `AliasesTab` (`AliasesSection`+`VariablesSection` на одной вкладке). Управление сущностями/workflow (CRUD `EntityType`, редактор `statuses`) переехало на вкладку бывших «Тегов» вторым разделом, рядом с `TagsSection`. Присвоение сущности+статуса конкретной закладке и её просмотр — там же, где теги (`BookmarkCard`/`LibraryTab`).

Заодно (в этой же сессии) переименован ряд вкладок в настройках, все — только смена отображаемого имени/файла-обёртки, без переименования лежащих в основе доменных понятий (`Tag`/`DomainAlias` и их секции/локаль-ключи `tagsSection`/`aliasesSection`/`variablesSection` не тронуты):
- «Поиск» → **«Библиотека»** (`SearchTab.tsx`→`LibraryTab.tsx`, `nav.search`→новый `nav.library`, иконка `IconSearch`→новая `IconLibrary`).
- «Теги» → **«Категории»** (`TagsTab.tsx`→`CategoriesTab.tsx`, `nav.tags`→`nav.categories`, `tagsTab.*`→`categoriesTab.*`).
- «Алиасы» → **«Сопоставления»** (`AliasesTab.tsx`→`MappingsTab.tsx`, `nav.aliases`→`nav.mappings`, `aliasesTab.*`→`mappingsTab.*`).

Дальнейшее переименование «Сущность»/«Entity» → «Категория»/«Category» непосредственно в видимом тексте интерфейса (не в коде) — см. `UI-9`.

**Примечание при сверке specs/Obsidian-доски (`UI-9`, 2026-08-14):** задача реализована 2026-08-13 (`git log` — `d5eebee add:[SEARCH] add entity and workflow`), но перенос из `tasks.md` был пропущен — обнаружено и исправлено задним числом при полной сверке доски со specs-файлами.

### SEARCH-4 — Присвоение тегов закладке: значок-редактор на карточке в Search
**Priority:** Medium
**Added:** 2026-08-11
**Completed:** 2026-08-13

Продолжение `SEARCH-3` (хранение тегов уже есть — `Tag`/`ITagRepository`/вкладка «Теги»). Реализовано с сознательным сужением объёма (ограничились только значком-редактором на уже сохранённой закладке, без quick-save popup — это отдельный follow-up, `SEARCH-6`) и с отклонением от исходно записанной схемы: вместо составного ключа `bookmarkTags: { bookmarkId, tagId }` выбран **multiEntry-индекс** Dexie — `bookmarkTags: { bookmarkId (PK), tagIds: string[] }`, схема `bookmarkId, *tagIds`. Это ближе всего в Dexie к тому, что в реляционных ORM даёт `@ManyToMany` (аннотаций там нет вообще, Dexie — не ORM): одна строка на закладку с массивом id тегов, `.where('tagIds').equals(tagId)` находит закладки по тегу без второй сущности и совпадает с принятым в `SHELF-1` паттерном «одна строка на закладку».

Реализовано: `BookmarkTagLink`/`BookmarkTagLinkField` (`types/`), таблица `bookmarkTags` (`db/index.ts`), `BookmarkTagLinkRepository`/`IBookmarkTagLinkRepository`, регистрация в `ServicesContext`. Каскад при удалении тега — `TagRepository.remove()` переопределён: в одной транзакции вычищает `tagId` из всех `bookmarkTags.tagIds` (`.where('tagIds').equals(id).modify(...)`), затем удаляет сам тег.

**Доработка UI (в той же сессии, после ревью)**: исходный круглый значок-карандаш (`IconEdit`) и выпадающий список (`@radix-ui/react-dropdown-menu`) заменены — переключено на **`@radix-ui/react-popover`** (у `DropdownMenu` нет публичного `Anchor`, позиция жёстко привязана к триггеру; у `Popover` есть `Popover.Anchor`, что даёт нужную развязку триггер/позиция без потери доступности). Чек-лист тегов — простые кнопки `role="checkbox"` внутри `PopoverContent`. Пользователю показаны 4 наброска в Claude Artifact; выбран вариант с триггером-ссылкой «Редактировать» в правом верхнем углу карточки, попап открывается у левого края (там, где начинается ряд тегов). Новые файлы: `components/ui/popover.tsx`, `hooks/useBookmarkTagEditor.ts` (комбинация `useTags`+`useBookmarkTagLink`), `components/bookmark/tags/{BookmarkTagChip,BookmarkTagList}.tsx`. Позже, в `UI-9` (2026-08-14), кнопка-триггер ещё раз переработана — с текстовой ссылки на полноценную `Button` с иконкой `IconTag` и подписью «Теги».

`BookmarkTagList` подключён только в `BookmarkCard.tsx` (вкладка «Библиотека», тогда ещё «Поиск»); `CompactBookmarkCard.tsx` (поиск в попапе) намеренно не тронут — узкая однострочная раскладка, редактирование тегов там впоследствии убрано целиком (см. `SEARCH-6`).

**Out of scope этой итерации**: присвоение тега в попапе quick-save при первом сохранении (см. `SEARCH-6`); юнит-тесты на `BookmarkTagLinkRepository`/каскад в `TagRepository`.

**Примечание при сверке specs/Obsidian-доски (`UI-9`, 2026-08-14):** задача реализована 2026-08-13 (`git log` — `c9d463c refactor:[UI] edit tags`, `5d98f4b refactor:[UI] refactor UI`), но перенос из `tasks.md` был пропущен — обнаружено и исправлено задним числом при полной сверке доски со specs-файлами.

### RULE-1 — Реализация ConsView
**Priority:** Low
**Added:** 2026-07-06
**Completed:** 2026-08-18

Подключить визуальный конструктор условий к `RuleEditor` как полноценное рекурсивное зеркало `RuleNode` (группы AND/OR/NOT на любой глубине, переключатель типа группы на месте, все 4 типа листьев — `term`/`terms`/`regex`/`wildcard` — с полем-автокомплитом по `PageMetaField`), а не ограниченную плоскую OR-групп-из-AND форму, которую изначально хардкодил прототип `ConsView`/`ConditionGroup`/`ConditionRow`. Двусторонняя синхронизация с `JsonView`: правка в любом из двух представлений обновляет другое. Глубокая спецификация и протокол интервью — `specs/tasks/RULE-1-consview-visual-builder/`.

### RULE-10 — Иерархические правила (вложенные подправила)
**Priority:** Medium
**Added:** 2026-07-29
**Completed:** 2026-08-18

Сейчас `BookmarkRule` (`src/types/`) — плоский список, без понятия родитель/потомок; `RulesTab`/`RuleEditor` показывают и оценивают правила одно за другим по `priority`. Спроектировано как дерево: `parentId?: string` на `BookmarkRule`; обход — на верхнем уровне (дети виртуального корня) ищем первое совпавшее правило по локальному `priority` среди siblings (не глобальному, как сейчас) — проверяется только **собственный** `condition` узла (без склеивания в `AND` с родителем: раз обход дошёл до потомка, родитель уже совпал), при совпадении спускаемся к его детям тем же способом, останавливаемся на самом глубоком совпавшем узле. Виртуальный корневой узел «по умолчанию» не хранится как `BookmarkRule` — собирается в памяти при старте расширения, но показывается как настоящий, неудаляемый и нередактируемый по condition корень дерева в UI.

**Решено:**
- `targetFolder`/`tagIds`/`entityTypeId`/`statusId` наследованию/каскадированию не подлежат — каждое правило указывает их полностью само, как сейчас.
- Re-parenting — вне периметра первой версии; `parentId` фиксируется при создании.
- Удаление правила с потомками — каскадное, обязательно за попапом-подтверждением с числом/списком затрагиваемых потомков; удаление правила без потомков — как и сегодня, сразу, без попапа.
- Множественное совпадение siblings на одном уровне — разрешается порядком (первый подошедший по `priority` среди siblings).
- Технология дерева в UI — hand-roll поверх Radix `Collapsible` (без сторонней библиотеки; сравнение через субагента отклонило `react-arborist`/`react-complex-tree`/`react-accessible-treeview`/`rc-tree`, а единственный годный вариант `@headless-tree` пока в Beta).
- `RuleEditor` **не меняется вообще** — секция «унаследовано от родителя» из исходного макета рассмотрена и отклонена (вложенность в дереве уже даёт нужный контекст). `ConsView`/`JsonView`/имя/приоритет/папка/категория/теги — без изменений.
- Формат хранения в Dexie — новое опциональное поле `parentId?: string` на существующей записи, без изменения схемы/индекса. Миграция существующих плоских правил не нужна — изменение обратно совместимо по построению.

Визуальный концепт утверждён пользователем и опубликован как Artifact: https://claude.ai/code/artifact/32a46e99-5266-40f6-b6a0-ce61a4555d91. Глубокая спецификация: `specs/tasks/RULE-10-hierarchical-rules/`.

### SEARCH-6 — Раздел «Дополнительно» в попапе: теги/категория, вручную и по подсказке правила; та же связка в редакторе правил
**Priority:** Medium
**Added:** 2026-08-13
**Completed:** 2026-08-18

Продолжение `SEARCH-4` (`changelog.md`): та задача сознательно ограничилась постфактум-редактированием тегов через карточку на вкладке «Библиотека», оставив присвоение тега прямо в попапе quick-save как отдельный follow-up. Поглотила `RULE-4` (`cancelled.md`) — по итогам дизайн-ревью с пользователем объём расширен: попап не только позволяет вручную назначить теги/категорию при сохранении, но и **подсказывает** их из сработавшего правила, а само правило (`BookmarkRule`) теперь несёт эти значения как прямой результат матчинга.

Дизайн прошёл три раунда правок с пользователем (артефакты не сохранены в репозитории, черновики только на сессию) — финальная раскладка ниже. Deep-spec: `specs/tasks/SEARCH-6-advanced-section-rule-links/`.

**Модель данных.** `BookmarkRule` (`src/types/rule.ts`) получает три опциональных поля рядом с существующим `targetFolder` — `tagIds?: string[]`, `entityTypeId?: string`, `statusId?: string`. Это результат совпадения условия, не новый узел DSL и не отдельная сущность. `BookmarkRuleField` дополняется `TAG_IDS`/`ENTITY_TYPE_ID`/`STATUS_ID`. Схема Dexie не меняется — это некопируемые в индекс обычные поля объекта в уже существующей таблице `bookmarkRules`.

**Попап («Дополнительно»):** свёрнутый по умолчанию блок между деревом папок и кнопкой «Сохранить», без своей заливки/рамки — только `border-top` цвета обычного бордера. Категория — переиспользуемый `EntitySegment`. Теги — новый presentational-компонент (чипы выбранных + кнопка «Теги», открывающая тот же попап-чеклист, что уже есть в `BookmarkTagList`), переиспользуемый в трёх местах: карточка (неизменное поведение, immediate-write), попап и `RuleEditor` (оба — локальный стейт до нажатия «Сохранить»). Строка «Подобрано правилом «X»» — простой приглушённый текст без иконки, исчезает при первой ручной правке категории/тега. Оба поля всегда редактируемые, не read-only. `QuickSaveFolderResolver`/`findMatchingRule` уже вычисляют совпавшее правило целиком — расширяются, чтобы отдавать не только `targetFolder`, но и `name`/`tagIds`/`entityTypeId`/`statusId`. `useQuickSave.save()` пишет вторым вызовом (`bookmarkTagLinkRepository`/`bookmarkEntityLinkRepository`) сразу после `bookmarkRepository.create()`, одним нажатием «Сохранить».

**`RuleEditor`:** два новых поля всегда видны в форме (без сворачивания), друг под другом (не в одну строку), без обрамляющего блока/заголовка — сразу «Категория», затем «Теги». Категория — только выбор `EntityType` (`EntitySegment`), без отдельного контрола статуса — `statusId` всегда авто-вычисляется как первый по `order` статус workflow выбранной категории. Редактирование существующего правила подхватывает уже сохранённые `tagIds`/`entityTypeId`/`statusId` в стейт формы, как остальные поля.

**Out of scope:** создание нового тега/категории прямо из попапа/`RuleEditor` (только выбор существующих); отдельный статус-пикер в `RuleEditor`; изменения в поведении редактирования на карточке «Библиотеки» за пределами вынесения presentational-части.

### ARCH-12 — Инвалидация локального стейта хуков при внешней записи в репозиторий (subscribe/notify)
**Priority:** Medium
**Added:** 2026-08-09
**Completed:** 2026-08-18

Обнаружено пользователем: `useBookmarkRules`/`useDomainAliases` (и, вероятно, хук вкладки «Переменные» над `pageMatchGroupRepository`) тянут данные один раз при маунте в локальный `useState` и обновляют его только через свои же `save`/`remove` — а `SettingsExportImportService.importSettings()` пишет в те же репозитории напрямую (`bookmarkRuleRepository.save()`/`domainAliasRepository.save()`/`pageMatchGroupRepository.save()` в цикле), минуя эти хуки. В результате после импорта настроек вкладки «Правила»/«Алиасы»/«Переменные» показывают устаревший список до ручного обновления страницы.

**Рассмотренные и отклонённые альтернативы**: 1) `dexie-react-hooks`/`useLiveQuery` — протаскивает знание о Dexie в хуки/компоненты, нарушая правило CLAUDE.md «repository layer is the only place that knows Dexie exists», жёстко привязывает к Dexie на случай будущей смены хранилища; 2) полноценный shared data-layer/стейт-менеджер (Redux/Zustand, TanStack Query) — избыточен для текущего объёма (6 репозиториев, ~10 хуков, нет кросс-сущностного производного состояния), и не решает саму проблему сигнала инвалидации лучше точечного фикса; 3) репозиторный `ChangeNotifier`/`subscribe`/`notify` с `batch()`-схлопыванием — был рабочим планом, пока не нашли корневую причину (см. ниже).

**Найдена и устранена корневая причина** (не архитектурная, а конкретная): `useBookmarkRules()` вызывается в `AppShell` (`src/entrypoints/options/App.tsx`), поднятый над вкладками — единственная причина: счётчик `ruleCount` в `OptionsSidebar`, который должен быть виден вне зависимости от активной вкладки. `useDomainAliases`/`usePageMatchGroups` уже вызываются внутри `AliasesTab`, то есть уже монтируются/размонтируются вместе с вкладкой. `ExportImportSection` (единственное место внешней записи в обход хуков) живёт только на вкладке Main — значит вкладки Rules/Aliases/Variables всегда размонтированы в момент импорта, и обычный ремонт при переходе на вкладку уже даёт свежий `getAll()`.

**Решение**: убрать счётчик `ruleCount` из `OptionsSidebar`/`App.tsx` (принято пользователем как продуктовый трейд-офф); перенести `useBookmarkRules()` из `AppShell` внутрь `RulesTab`, по аналогии с `AliasesTab`. `ChangeNotifier`/subscribe-инфраструктура не нужна. Известное ограничение: держится на неявном инварианте «внешняя запись бывает только с вкладки Main» — не закреплено архитектурно; если появится ещё одно место внешней записи (например, глобальная кнопка импорта), баг может вернуться — тогда стоит пересмотреть subscribe/notify.

Подробности и протокол решения — `specs/tasks/ARCH-12-hook-tab-isolation/`.

