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

