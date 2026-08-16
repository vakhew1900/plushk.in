# Ideas

Unconfirmed, not-yet-scoped ideas for future work — lighter than a `backlog.md` task. No ID, no priority, no required fields. When an idea is picked up, promote it to a proper entry in `backlog.md` (assign it an ID/priority/added date per `CLAUDE.md`) and remove it from here.

### Interactive menu on bookmark card click

Right now (see `SEARCH-1` in `tasks.md`) clicking a bookmark card in search results just navigates to the bookmark's URL. Later, clicking (or a secondary interaction — right-click, long-press, a dedicated affordance on the card) could instead open a quick-action menu: open, change folder/rule, add a tag, etc. Not worked out: what actions belong in the menu, how it coexists with "just open the page" as the common case, whether it needs a different trigger than plain click to avoid surprising users.

### Auto-sort for natively created bookmarks (star icon / Ctrl+D / import / cross-device sync)

`UI-4` (see `tasks.md`) removes automatic sorting for bookmarks created outside the extension's own popup — `bookmarks.onCreated` no longer applies rules or moves anything, in any mode. The user explicitly wants sorting to stay scoped to their own quick-save popup for now ("за сохранение отвечаю только в своём попапе"). Bringing native auto-sort back later is a real possibility, but not designed: it would need its own answer to the echo-suppression problem that `suppressNextCreated` used to solve (the old flag/mechanism is deleted along with `UI-4`, not preserved for reuse), a decision on whether it's silent (old `Auto`) or confirm-first (old `Hint`) again, and whether `bookmarks.onChanged` (re-sorting on title/url edits — never actually implemented, only documented) is in scope too. Don't assume the old three-mode design is the right starting point if this gets picked up — reconsider from scratch given whatever the popup-only model looks like by then.

### Deep-link from popup into a specific options tab

`App.tsx` (`AppShell`) now persists the active options tab across page refresh via `useOptionsTab` (`src/hooks/useOptionsTab.ts`), reading/writing a `?tab=` query param with `URLSearchParams` + `history.replaceState` — no router, hand-rolled. The other use case flagged alongside it is still open and unimplemented: deep-linking from the popup straight into a specific tab, e.g. a "Manage Rules" button in the popup opens options already on `RulesTab`. Not designed: how the popup would open `options.html` with a given `?tab=` value (likely `browser.runtime.openOptionsPage` doesn't support a URL/query param directly, so this may need `browser.tabs.create` with an explicit URL instead), and whether it should also start persisting across full browser restarts (currently URL-only, lost once the options tab is closed).

Related tradeoff accepted when choosing the hand-rolled hook over a routing library (react-router/wouter): it only works because there's exactly one query param and one page. If options ever becomes genuinely multi-page (not just one `options.html` with client-side tab switching), a real router would be needed instead of extending `useOptionsTab` further.

### Google Drive images — store a link, not a full Drive integration

Пользователь спросил, можно ли получить токен Google Drive, чтобы расширение могло брать оттуда изображения — при уточнении оказалось, что цель уже, чем полноценная интеграция: «я просто хотел бы там хранить ссылки на изображения и всё». То есть речь не про просмотр/выбор файлов из Drive внутри расширения, а про поле-ссылку на изображение (где именно — не решено: на закладке? на категории/`EntityType`, как обложка? где-то ещё?), которое физически может указывать на файл в Google Drive.

Если файл в Drive расшарен «anyone with the link can view», ссылку можно рендерить напрямую как `<img src>` (например через `https://drive.google.com/uc?export=view&id=FILE_ID`) без какого-либо OAuth — просто текстовое поле для URL. OAuth понадобился бы только если: (а) файлы приватные и нужен авторизованный доступ для показа, или (б) хочется штатный Google Picker для выбора файла из Drive прямо в UI расширения, а не ручная вставка ссылки пользователем.

Если OAuth всё же понадобится (сценарий (а) или (б) выше), technical findings из обсуждения:
- Это не то же самое, что коннектор «claude.ai Google Drive» у Claude Code — расширению нужна собственная OAuth-интеграция.
- Chrome: `chrome.identity.getAuthToken()`, нужен блок `oauth2` в манифесте (`client_id` + скоупы) из проекта в Google Cloud; Chrome сам показывает согласие и кэширует токен.
- Firefox (проект собирается под оба — `dev`/`build` и `dev:firefox`/`build:firefox`): аналога `chrome.identity.getAuthToken` нет — нужен более ручной `browser.identity.launchWebAuthFlow()`.
- Скоуп — главный компромисс: `drive.file` (только файлы, созданные самим приложением или явно открытые пользователем через пикер) — просто, без ревью Google даже при масштабировании. `drive.readonly` и шире — «restricted scope» у Google: после ~100 тестовых пользователей нужна их проверка CASA (реальные время/деньги/политика конфиденциальности), а не формальность.

Не решено: где именно в модели данных живёт ссылка на изображение (закладка, категория, что-то ещё); нужен ли вообще выбор файла из Drive через Picker, или пользователь просто вставляет готовую ссылку вручную (в таком случае OAuth скорее всего не нужен вообще).

### MCP (Model Context Protocol) integration

The extension itself can't host an MCP server directly — MCP needs a long-lived stdio/HTTP transport, and the MV3 service worker is event-driven and gets suspended, so it can't act as a persistent server. A feasible shape would be a separate local companion process (Node.js), similar in spirit to the existing optional Obsidian Local REST API integration, bridging Claude Desktop/Claude Code to the extension's data (`BookmarkRule`, `PageMeta`, folders) — reading/writing via `chrome.storage`/native messaging, or via the Markdown export. Motivation: the spec already reserves an `[ai]` block for LLM integration, and MCP would be the natural "reverse direction" for it — not the extension calling an LLM, but an LLM assistant getting read/write access to the user's bookmarks and rules through natural language (e.g. "find all bookmarks about X", "create a rule that sorts reddit.com into Social/Reddit", "show bookmarks that don't match any rule"). Not designed yet: the transport mechanism (native messaging vs. HTTP bridge vs. reading the Markdown export), the auth/security model for a local server touching bookmark data, and how much of the DSL should be exposed for the assistant to write vs. just read.
