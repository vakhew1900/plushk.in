// The value WXT uses for its `-b` build-target flag (`npm run dev`/`build`
// vs `dev:firefox`/`build:firefox`) — matches both the runtime
// `import.meta.env.BROWSER` string and the `env.browser` passed into
// `wxt.config.ts`'s manifest function. Named here so call sites branching on
// the build target don't compare against raw string literals.
export const BrowserTarget = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
} as const;
export type BrowserTarget = typeof BrowserTarget[keyof typeof BrowserTarget];
