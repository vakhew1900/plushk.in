# Verification

Manual correctness checklist — things to verify by hand in the running extension (dev build, both `npm run dev` and `npm run dev:firefox`) since they aren't covered by unit tests (React components aren't tested per `CLAUDE.md`). Grouped by task category (see `specification.md`'s task-categories table). Check an item after confirming it in both browsers unless noted otherwise.

## SEARCH

- [ ] Favicon display in search results: real site icon shown on Chrome (via the `_favicon` endpoint, `src/lib/browser-constants/faviconUrl.ts`); letter fallback shown on Firefox (no native favicon API available — see `FaviconUrl.FIREFOX`) and on Chrome whenever a site truly has no icon.
