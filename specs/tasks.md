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

