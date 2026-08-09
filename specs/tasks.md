# Tasks

Tasks currently in progress. Moved here from `backlog.md` when work starts.

### RULE-1 — Реализация ConsView
**Priority:** Low
**Added:** 2026-07-06

Подключить визуальный конструктор условий к `RuleEditor` как полноценное рекурсивное зеркало `RuleNode` (группы AND/OR/NOT на любой глубине, переключатель типа группы на месте, все 4 типа листьев — `term`/`terms`/`regex`/`wildcard` — с полем-автокомплитом по `PageMetaField`), а не ограниченную плоскую OR-групп-из-AND форму, которую изначально хардкодил прототип `ConsView`/`ConditionGroup`/`ConditionRow`. Двусторонняя синхронизация с `JsonView`: правка в любом из двух представлений обновляет другое. Глубокая спецификация и протокол интервью — `specs/tasks/RULE-1-consview-visual-builder/`.

### ARCH-12 — Инвалидация локального стейта хуков при внешней записи в репозиторий (subscribe/notify)

**Priority:** Medium
**Added:** 2026-08-09

Обнаружено пользователем: `useBookmarkRules`/`useDomainAliases` (и, вероятно, хук вкладки «Переменные» над `pageMatchGroupRepository`) тянут данные один раз при маунте в локальный `useState` и обновляют его только через свои же `save`/`remove` — а `SettingsExportImportService.importSettings()` пишет в те же репозитории напрямую (`bookmarkRuleRepository.save()`/`domainAliasRepository.save()`/`pageMatchGroupRepository.save()` в цикле), минуя эти хуки. В результате после импорта настроек вкладки «Правила»/«Алиасы»/«Переменные» показывают устаревший список до ручного обновления страницы.

**Рассмотренные и отклонённые альтернативы**: 1) `dexie-react-hooks`/`useLiveQuery` — протаскивает знание о Dexie в хуки/компоненты, нарушая правило CLAUDE.md «repository layer is the only place that knows Dexie exists», жёстко привязывает к Dexie на случай будущей смены хранилища; 2) полноценный shared data-layer/стейт-менеджер (Redux/Zustand, TanStack Query) — избыточен для текущего объёма (6 репозиториев, ~10 хуков, нет кросс-сущностного производного состояния), и не решает саму проблему сигнала инвалидации лучше точечного фикса; 3) репозиторный `ChangeNotifier`/`subscribe`/`notify` с `batch()`-схлопыванием — был рабочим планом, пока не нашли корневую причину (см. ниже).

**Найдена и устранена корневая причина** (не архитектурная, а конкретная): `useBookmarkRules()` вызывается в `AppShell` (`src/entrypoints/options/App.tsx`), поднятый над вкладками — единственная причина: счётчик `ruleCount` в `OptionsSidebar`, который должен быть виден вне зависимости от активной вкладки. `useDomainAliases`/`usePageMatchGroups` уже вызываются внутри `AliasesTab`, то есть уже монтируются/размонтируются вместе с вкладкой. `ExportImportSection` (единственное место внешней записи в обход хуков) живёт только на вкладке Main — значит вкладки Rules/Aliases/Variables всегда размонтированы в момент импорта, и обычный ремонт при переходе на вкладку уже даёт свежий `getAll()`.

**Решение**: убрать счётчик `ruleCount` из `OptionsSidebar`/`App.tsx` (принято пользователем как продуктовый трейд-офф); перенести `useBookmarkRules()` из `AppShell` внутрь `RulesTab`, по аналогии с `AliasesTab`. `ChangeNotifier`/subscribe-инфраструктура не нужна. Известное ограничение: держится на неявном инварианте «внешняя запись бывает только с вкладки Main» — не закреплено архитектурно; если появится ещё одно место внешней записи (например, глобальная кнопка импорта), баг может вернуться — тогда стоит пересмотреть subscribe/notify.

Подробности и протокол решения — `specs/tasks/ARCH-12-hook-tab-isolation/`.

### ARCH-14 — useBookmarkRules не пересортировывает список по priority после локального save()

**Priority:** Medium
**Added:** 2026-08-09

`useBookmarkRules.save()` (`src/hooks/useBookmarkRules.ts:25`) обновляет локальный `items` на месте (`prev.map(...)`) или добавляет в конец (`[...prev, rule]`), не пересортировывая по `priority` — хотя `BookmarkRuleRepository.getAll()` отдаёт список строго отсортированным (`orderBy('priority').reverse()`), и именно на этот порядок опирается и вычисление правил (`findMatchingRule`), и отображаемый в `RuleListItem`/`RulesTab` номер строки как ранг приоритета. Если пользователь меняет `priority` существующего правила в `RuleEditor` и жмёт «Сохранить», список в UI остаётся в прежнем порядке с прежними номерами до перезагрузки страницы настроек — вводит в заблуждение относительно реального порядка вычисления правил. Обнаружено при архитектурном аудите по запросу пользователя; смежно с `ARCH-12` (там — рассинхронизация стейта хука с записями *извне*, через импорт; здесь — тот же хук расходится с репозиторием даже через собственный `save()`).

**Уточнение**: НЕ чинится автоматически фиксом `ARCH-12` (тот чинит только кросс-вкладочную рассинхронизацию от *внешней* записи; здесь баг в том, что хук расходится с собственным `save()` в рамках одного и того же монтирования). Отдельный точечный фикс: пересортировывать `items` по `priority` (descending) после `save()`.

### ARCH-7 — Generic-базовый класс для CRUD-бойлерплейта репозиториев
**Priority:** Low
**Added:** 2026-07-29

`BookmarkRuleRepository`, `DomainAliasRepository`, `PageMatchGroupRepository` (`src/repository/`) почти построчно дублируют `getAll/getById/save/remove` через Dexie — отличаются только именем таблицы. `ModeSettingsRepository`/`DefaultFolderSettingsRepository` аналогично дублируют обёртку `storage.defineItem().get()/.set()`. Обнаружено при архитектурном аудите.

**Подхвачена вместе с `ARCH-12`** по просьбе пользователя (заодно, раз репозитории и так трогаем). Раз `ARCH-12` больше не требует subscribe/notify (см. выше), это чистый CRUD-бойлерплейт рефакторинг: `DexieRepository<T, K>` (Template Method) для трёх Dexie-репозиториев, `StorageItemRepository<T>` для двух repository поверх `wxt/utils/storage`; специфичную логику (`toStored`/`fromStored` Map↔object в `PageMatchGroupRepository`) — в наследниках. Без subscribe/notify в базовых классах.

Точная сигнатура — `specs/tasks/ARCH-7-generic-repository-base/`.

### UI-5 — Универсальный toast (всплывающее уведомление) в правом нижнем углу
**Priority:** Medium
**Added:** 2026-08-09

Сейчас после импорта/экспорта настроек (`ExportImportSection.tsx`) нет никакой success-обратной связи, а ошибка показывается статичным inline-текстом под кнопками (`useSettingsExportImport.ts`) — легко пропустить. Обнаружено пользователем при обсуждении ARCH-12/14/7.

**Решение**: универсальный toast (не завязанный на импорт/экспорт конкретно) — семантический вариант `ToastVariant` (`success`/`error`, `types/toast.ts`, `as const` по конвенции проекта), цвет берётся из уже существующих `--green`/`--red` токенов темы (`assets/globals.css`), а не произвольным цветом-пропом. Автозакрытие через таймаут + ручное закрытие крестиком (стандартное поведение Radix `Toast.Root`). Показывается в правом нижнем углу через `Toast.Viewport`.

Архитектура (учитывая `boundaries/dependencies` ESLint-правило — `context/` не может импортировать из `components/`): `types/toast.ts` (`ToastVariant` + `ToastItem`, общий тип для контекста и компонента) → `context/ToastContext.tsx` (чистый стейт — очередь `toasts`, `show()`, `dismiss()`, без JSX-разметки самого тоста) → `hooks/useToast.ts` (тонкий хук поверх контекста, как `useTheme`/`useTranslation`) → `components/ui/toast.tsx` (тонкая обёртка над Radix `Toast.Root/Title/Description/Close`, по одному тосту, иконки `IconCheck`/`IconX` уже есть в `components/icons/`) → `components/Toaster.tsx` (владеет Radix `Toast.Provider`/`Toast.Viewport`, мапит очередь из `useToast()` на `<Toast>`). `Toaster` монтируется один раз в `entrypoints/options/App.tsx` (внутри нового `ToastProvider`, рядом с `Theme`/`Locale`/`Services`).

`@radix-ui/react-toast` добавлен как прямая зависимость (по образцу `@radix-ui/react-switch`/`@radix-ui/react-radio-group` — уже используются в проекте, тот же паттерн тонких обёрток в `components/ui/`).

`useSettingsExportImport.ts` — существующий inline-текст ошибки (`error`-стейт, `ExportImportSection.tsx:42`) убирается полностью, заменяется вызовом `useToast().show(...)` на успех/ошибку и экспорта, и импорта.

На момент постановки не решено/сознательно ограничено: только вкладка Options подключена (`Toaster`/`ToastProvider` в `App.tsx`); popup не подключён — нет текущего сценария использования там, при появлении подключить туда тем же способом.

