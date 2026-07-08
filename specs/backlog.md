# Backlog

Tasks not yet started. When work begins on one, move it to `tasks.md`.

### RULE-1 — Реализация ConsView
**Priority:** Low
**Added:** 2026-07-06

Подключить визуальный конструктор условий (`ConsView` → `ConditionGroup` → `ConditionRow`) к `RuleEditor`: сейчас условия редактируются только через сырой JSON в `JsonView`, а панель с бейджами AND/OR/NOT существует в коде, но нигде не используется.

### ARCH-1 — Рассмотреть менеджер стейта/контекста
**Priority:** Low
**Added:** 2026-07-06

Сейчас используется голый React Context (`LocaleContext`, `ThemeContext`, `ServicesContext`) + по хуку на сущность. Если количество контекстов и cross-компонентных состояний вырастет, стоит рассмотреть более общее решение (Redux, Zustand и т.п.) вместо ручного прокидывания и точечных хуков.

