# Tasks

Tasks currently in progress. Moved here from `backlog.md` when work starts.

### NOTE-1 — Заметки, привязанные к закладкам
**Priority:** Medium
**Added:** 2026-08-21

Дать пользователю создавать текстовые заметки (заголовок + обычный текст) и привязывать их к закладкам — свободный пользовательский текст, отдельно от `Tag`/`EntityType` (структурная таксономия, `SEARCH`/`SHELF`) и от `PageMeta.description` (авто-извлекается со страницы, не редактируется пользователем). Отдельная сущность `Note` (таблица Dexie `notes`, много заметок на закладку) с каскадным удалением через существующий `BG-1`; UI — новая вкладка «Заметки» внутри `BookmarkSettingsDialog` (уже была disabled-заготовкой в `SettingsTabRail`), список заметок раскладкой «блоками» (masonry, Google Keep-style). Полная спецификация — `specs/tasks/NOTE-1-bookmark-notes/`.
